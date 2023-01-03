import { IUser } from "../models/user";
import { usersPath } from "../app/constants";
import { v4 as uuid_v4, validate } from "uuid";
import { User } from "../entity/user";
import { NotFoundError, ValidationError } from "../app/errors";
import { INVALID_DATA_ERROR, INVALID_ID_ERROR, USER_NOT_FOUND_ERROR } from "../app/constants";
import { fork } from "child_process";
import cluster from "cluster";

export class UserService {
    process: any = process;

    usersDB: IUser[];

    constructor() {
        if (cluster.isPrimary) {
            this.process = fork(usersPath);
        }
    }

    private async getDBUsers(): Promise<IUser[]> {
        this.process.send({ method: "get" });
        return new Promise((res) => {
            this.process.once("message", (users: IUser[]) => {
                this.usersDB = users;
                res(users);
            });
        });
    }

    public async createUser(data: IUser): Promise<IUser> {
        const users: IUser[] = await this.getDBUsers();
        const newUser: IUser = Object.assign(new User(), { ...data, id: uuid_v4() });
        users.push(newUser);
        return new Promise((res) => {
            this.process.send({ method: "post", users: users });
            res(newUser);
        });
    }

    public async editUser(data: IUser, id: string): Promise<IUser> {
        const users: IUser[] = await this.getDBUsers();
        let user: IUser = users.find((el) => el.id === id);
        if (user) {
            user = Object.assign(user, { ...data });
            return new Promise((res) => {
                this.process.send({ method: "post", users: users });
                res(user);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    public async getAllUsers(): Promise<IUser[]> {
        const users: IUser[] = await this.getDBUsers();
        return new Promise((res) => {
            res(users);
        });
    }

    public async getUserById(id: string): Promise<IUser> {
        const users: IUser[] = await this.getDBUsers();
        const user: IUser = users.find((el) => el.id === id);
        if (user) {
            return new Promise((res) => {
                res(user);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    public async deleteUser(id: string): Promise<null> {
        const users: IUser[] = await this.getDBUsers();
        const userIndex: number = users.findIndex((el) => el.id === id);
        if (userIndex >= 0) {
            users.splice(userIndex, 1);
            return new Promise((res) => {
                this.process.send({ method: "post", users: users });
                res(null);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    public validateUserId(id: string): void {
        if (!validate(id)) {
            throw new ValidationError(INVALID_ID_ERROR);
        }
    }

    public validateData(body: IUser): void {
        if (body.id) delete body.id;
        const username: string = body.username;
        const age: number = body.age;
        const hobbies: string[] = body.hobbies;
        const usernameIsString: boolean = typeof username === "string";
        const ageIsNumber: boolean = typeof age === "number";
        const hobbiesIsArray: boolean = Array.isArray(hobbies);
        const isValidHobbies: boolean = hobbies?.every((el: any) => typeof el === "string");
        if (!username || !usernameIsString || !age || !ageIsNumber || !hobbiesIsArray || !hobbies || !isValidHobbies) {
            throw new ValidationError(INVALID_DATA_ERROR);
        }
    }
}
