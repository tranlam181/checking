import notifier from "node-notifier";
import { getFullUrl } from "../helpers";
import { WebClient } from "@slack/web-api";

export class NotifyService {
  web: WebClient;

  constructor() {
    this.web = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  toString() {
    return "NotifyService";
  }

  sendWindownNotify(number: string) {
    this.web.chat.postMessage({
      mrkdwn: true,
      text: `<${getFullUrl(number)}|${number}>`,
      channel: "#general",
    });

    notifier.notify({
      title: number,
      message: number,
      sound: true,
      wait: true,
      timeout: 5000,
      open: getFullUrl(number),
    });
  }
}
