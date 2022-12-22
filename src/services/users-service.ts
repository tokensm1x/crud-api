import getUsersDb from "../in-memory-db/get-users-db";

export class UserService {
    constructor() {}

    async createUser() {
        const users = await getUsersDb();
        return new Promise((resolve, reject) => {
            resolve(users);
        });
    }
}
