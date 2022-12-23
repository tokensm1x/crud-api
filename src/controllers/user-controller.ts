import { IUser } from "src/models/user";
import { UserService } from "../services/users-service";

export class UserController {
    constructor(private readonly usersService: UserService) {}

    createUser(data: IUser): Promise<IUser> {
        this.usersService.validateData(data);
        return this.usersService.createUser(data);
    }

    getAllUsers(): Promise<IUser[]> {
        return this.usersService.getAllUsers();
    }

    getUserById(id: string): Promise<IUser> {
        this.usersService.validateUserId(id);
        return this.usersService.getUserById(id);
    }

    editUser(data: IUser, id: string): Promise<IUser> {
        this.usersService.validateUserId(id);
        this.usersService.validateData(data);
        return this.usersService.editUser(data, id);
    }

    deleteUser(id: string): Promise<null> {
        this.usersService.validateUserId(id);
        return this.usersService.deleteUser(id);
    }
}
