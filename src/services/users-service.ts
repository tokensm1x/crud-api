import { IUser } from "src/models/user";
import { eventEmitter } from "../in-memory-db/constants";
import { v4 as uuid_v4, validate } from "uuid";
import { User } from "../entity/user";
import {
    INVALID_DATA_ERROR,
    INVALID_ID_ERROR,
    NotFoundError,
    USER_NOT_FOUND_ERROR,
    ValidationError,
} from "../app/errors";
import cluster from "cluster";

export class UserService {
    usersDB: IUser[];

    constructor() {}
    async createUser(data: IUser): Promise<IUser> {
        const users = await this.getDBUsers();
        const newUser: IUser = Object.assign(new User(), { ...data, id: uuid_v4() });
        users.push(newUser);
        return new Promise((res) => {
            process.send({ method: "post", users: users });
            res(newUser);
        });
    }

    async editUser(data: IUser, id: string): Promise<IUser> {
        const users = await this.getDBUsers();
        let user: IUser = users.find((el) => el.id === id);
        if (user) {
            user = Object.assign(user, { ...data });
            return new Promise((res) => {
                process.send({ method: "post", users: users });
                res(user);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    async getAllUsers(): Promise<IUser[]> {
        const users = await this.getDBUsers();
        return new Promise((res) => {
            res(users);
        });
    }

    async getUserById(id: string): Promise<IUser> {
        const users = await this.getDBUsers();
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
        const users = await this.getDBUsers();
        const userIndex: number = users.findIndex((el) => el.id === id);
        if (userIndex >= 0) {
            users.splice(userIndex, 1);
            return new Promise((res) => {
                process.send({ method: "post", users: users });
                res(null);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    async getDBUsers(): Promise<IUser[]> {
        process.send({ method: "get" });
        return new Promise((res) => {
            process.once("message", (users: IUser[]) => {
                this.usersDB = users;
                res(users);
            });
        });
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
