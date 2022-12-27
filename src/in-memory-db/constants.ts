import { resolve } from "path";
import { cwd } from "process";
import EventEmitter from "events";

export const usersCp = resolve(cwd(), "src/in-memory-db/users-db.ts");
export const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(0);
