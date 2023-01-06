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

    private async dbRequest(method, data?): Promise<IUser[] | IUser | any> {
        this.process.send({ method: method, data: data });
        return new Promise((res) => {
            this.process.once("message", (response: any) => {
                res(response);
            });
        });
    }

    public async createUser(data: IUser): Promise<IUser> {
        const response: IUser = await this.dbRequest("post", { data: data });
        return new Promise((res) => {
            res(response);
        });
    }

    public async editUser(data: IUser, id: string): Promise<IUser> {
        const response: IUser | null = await this.dbRequest("put", { data: data, id: id });
        if (response) {
            return new Promise((res) => {
                res(response);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    public async getAllUsers(): Promise<IUser[]> {
        const response: IUser[] = await this.dbRequest("getAll");
        return new Promise((res) => {
            res(response);
        });
    }

    public async getUserById(id: string): Promise<IUser> {
        const response: IUser | null = await this.dbRequest("getById", { id: id });
        if (response) {
            return new Promise((res) => {
                res(response);
            });
        } else {
            throw new NotFoundError(USER_NOT_FOUND_ERROR);
        }
    }

    public async deleteUser(id: string): Promise<null> {
        const response: any = await this.dbRequest("delete", { id: id });
        if (response) {
            return new Promise((res) => {
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
