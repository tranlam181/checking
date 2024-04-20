import { delay, getFullUrl } from "../helpers";
import { AxiosService } from "./axios.service";
import { FileService } from "./file.service";
import { NotifyService } from "./notify.service";

export class NumberChecking {
  private checkingNumbers: Array<string> = [];
  private notifyService: NotifyService;
  private allowRunning = true;

  static intervalToken = 0;
  static setIntervalToken(token: number) {
    NumberChecking.intervalToken = token;
  }
  static clearInterval() {
    clearInterval(NumberChecking.intervalToken);
  }

  constructor(notifyService: NotifyService) {
    const inputNumbers = FileService.readFileSync("input.txt");
    this.notifyService = notifyService;
    this.setCheckingNumber(inputNumbers);
  }

  private setCheckingNumber(checkingNumbers: Array<string>) {
    this.checkingNumbers = [...checkingNumbers];
  }

  toString() {
    return this.checkingNumbers;
  }

  public async execute() {
    while (this.allowRunning) {
      try {
        const recheckNumbers: Array<string> = [];

        console.info(
          "Start checking",
          this.checkingNumbers.length,
          this.checkingNumbers
        );

        for (const number of this.checkingNumbers) {
          console.info("Checking...", number);
          let rs;
          try {
            rs = await AxiosService.get(getFullUrl(number));
          } catch (err) {
            rs = "";
            console.error({ msg: "Checking error...", number, err });
          }

          if (rs.length) {
            console.info({ msg: "ONLINE", number });

            this.notifyService.notify(number);
            continue;
          }

          recheckNumbers.push(number);
        }

        console.info("End checking, re-check", recheckNumbers);
        this.setCheckingNumber(recheckNumbers);

        this.allowRunning = false;
        await delay(+(process.env.JOB_INTERVAL || 31000));
      } catch (err) {
        console.error("execute() error", err);
      }
    }
  }
}
