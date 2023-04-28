import { setupWorker } from "msw";
import { handlers } from "./handlers";

const worker = setupWorker(...handlers);

if (import.meta.env.DEV) {
  worker.start();
}
