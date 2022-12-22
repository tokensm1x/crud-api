import { resolve } from "path";
import { cwd } from "process";
import { readFile } from "fs/promises";

const usersDbPath = resolve(cwd(), "src/in-memory-db/users.json");

export default async function getUsersDb() {
    const users = (await readFile(usersDbPath)).toString();
    return new Promise((res, rej) => {
        res(JSON.parse(users));
    });
}
