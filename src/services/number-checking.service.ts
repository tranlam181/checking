import { Logger } from "sitka";
import { NotifyService } from "./notify.service";
import { FileService } from "./file.service";
import { AxiosService } from "./axios.service";
import { delay, getFullUrl } from "../helpers";

export class NumberChecking {
  private checkingNumbers: Array<string> = [];
  private _logger: Logger;
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
    this._logger = Logger.getLogger({ name: this.constructor.name });
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

        this._logger.info("Start checking", this.checkingNumbers.length, this.checkingNumbers);

        for (const number of this.checkingNumbers) {
          this._logger.info("Checking...", number);
          let rs;
          try {
            rs = await AxiosService.get(getFullUrl(number));
          } catch (err) {
            rs = "";
            this._logger.error("Checking error...", number, err);
          }

          if (rs.length) {
            this._logger.info("ONLINE ", number);

            this.notifyService.sendWindownNotify(number);
            continue;
          }

          recheckNumbers.push(number);
        }

        this._logger.info("End checking, re-check", recheckNumbers);
        this.setCheckingNumber(recheckNumbers);

        this.allowRunning = false;
        await delay(+(process.env.JOB_INTERVAL || 31000));
      } catch (err) {
        this._logger.error("execute() error", err);
      }
    }
  }
}
