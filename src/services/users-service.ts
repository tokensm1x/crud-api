import { IUser } from "src/models/user";
import { getUsersDb, usersDbPath } from "../in-memory-db/get-users-db";
import { writeFile } from "fs/promises";
import { v4 as uuid_v4, validate } from "uuid";
import { User } from "../entity/user";
import {
    INVALID_DATA_ERROR,
    INVALID_ID_ERROR,
    NotFoundError,
    USER_NOT_FOUND_ERROR,
    ValidationError,
} from "../app/errors";
export class UserService {
    constructor() {}

    async createUser(data: IUser): Promise<IUser> {
        const users: IUser[] = await getUsersDb();
        const newUser: IUser = Object.assign(new User(), { ...data, id: uuid_v4() });
        users.push(newUser);
        await writeFile(usersDbPath, JSON.stringify(users));
        return new Promise((res) => {
            res(newUser);
        });
    }

    async editUser(data: IUser, id: string): Promise<IUser> {
        const users: IUser[] = await getUsersDb();
        let user: IUser = users.find((el) => el.id === id);
        if (user) {
            user = Object.assign(user, { ...data });
            await writeFile(usersDbPath, JSON.stringify(users));
            return new Promise((res) => {
                res(user);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    async getAllUsers(): Promise<IUser[]> {
        const users: IUser[] = await getUsersDb();
        return new Promise((res) => {
            res(users);
        });
    }

    async getUserById(id: string): Promise<IUser> {
        const users: IUser[] = await getUsersDb();
        const user: IUser = users.find((el) => el.id === id);
        if (user) {
            return new Promise((res) => {
                res(user);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    async deleteUser(id: string): Promise<null> {
        const users: IUser[] = await getUsersDb();
        const userIndex: number = users.findIndex((el) => el.id === id);
        if (userIndex >= 0) {
            users.splice(userIndex, 1);
            await writeFile(usersDbPath, JSON.stringify(users));
            return new Promise((res) => {
                res(null);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    validateUserId(id: string): void {
        if (!validate(id)) {
            throw new ValidationError(INVALID_ID_ERROR);
        }
    }

    validateData(body: IUser): void {
        if (body.id) delete body.id;
        const username = body.username;
        const age = body.age;
        const hobbies = body.hobbies;
        const usernameIsString = typeof username === "string";
        const ageIsNumber = typeof age === "number";
        const hobbiesIsArray = Array.isArray(hobbies);
        const isValidHobbies = hobbies?.every((el: any) => typeof el === "string");
        if (!username || !usernameIsString || !age || !ageIsNumber || !hobbiesIsArray || !hobbies || !isValidHobbies) {
            throw new ValidationError(INVALID_DATA_ERROR);
        }
    }
}
