import { resolve } from "path";
import { cwd } from "process";
import { readFile } from "fs/promises";
import { IUser } from "src/models/user";

export const usersDbPath = resolve(cwd(), "src/in-memory-db/users.json");

export async function getUsersDb(): Promise<IUser[]> {
    const users: string = (await readFile(usersDbPath)).toString();
    return new Promise((res) => {
        res(JSON.parse(users));
    });
}
