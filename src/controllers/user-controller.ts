import { UserService } from "../services/users-service";

export class UserController {
    constructor(private readonly usersService: UserService) {}

    createUser() {
        return this.usersService.createUser();
    }
}
