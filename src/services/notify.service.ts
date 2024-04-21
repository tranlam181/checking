import axios from "axios";
import notifier from "node-notifier";
import { getFullUrl } from "../helpers";

interface INotify {
  notify(phoneNumber: string): void;
}

class SlackNotify implements INotify {
  notify(phoneNumber: string): void {
    axios
      .post(
        "https://hooks.slack.com/services/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",
        {
          text: `<${getFullUrl(phoneNumber)}|${phoneNumber}>`,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .catch((err) => console.error({ msg: "SlackNotify error", err }));
  }
}

class WindownNotify implements INotify {
  notify(phoneNumber: string): void {
    notifier.notify({
      title: phoneNumber,
      message: phoneNumber,
      sound: true,
      wait: true,
      timeout: 5000,
      open: getFullUrl(phoneNumber),
    });
  }
}

export class NotifyService {
  private notifiers: INotify[] = [];

  constructor() {
    this.notifiers.push(new SlackNotify());
    this.notifiers.push(new WindownNotify());
  }

  public notify(phoneNumber: string) {
    this.notifiers.forEach((notifier) => {
      notifier.notify(phoneNumber);
    });
  }
}
