import dotenv from "dotenv";
import { NotifyService } from "./services/notify.service";
import { NumberChecking } from "./services/number-checking.service";
dotenv.config();

const notifyService = new NotifyService();
const numberChecking = new NumberChecking(notifyService);
numberChecking.execute();

// notifyService.notify("905234765");
