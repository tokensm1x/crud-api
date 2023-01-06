import { User } from "../entity/user";
import { IUser } from "src/models/user";
import { v4 as uuid_v4 } from "uuid";

const usersDB: IUser[] = [];

process.on("message", (data: any) => {
    switch (data.method) {
        case "put": {
            let user: IUser = usersDB.find((el) => el.id === data.data.id);
            if (user) {
                user = Object.assign(user, { ...data.data.data });
                process.send(user);
            } else {
                process.send(null);
            }
            break;
        }
        case "post": {
            const newUser: IUser = Object.assign(new User(), { ...data.data.data, id: uuid_v4() });
            usersDB.push(newUser);
            process.send(newUser);
            break;
        }
        case "getAll": {
            process.send(usersDB);
            break;
        }
        case "getById": {
            let user: IUser = usersDB.find((el) => el.id === data.data.id);
            process.send(user ? user : null);
            break;
        }
        case "delete": {
            const userIndex: number = usersDB.findIndex((el) => el.id === data.data.id);
            if (userIndex >= 0) {
                usersDB.splice(userIndex, 1);
                process.send("Ok");
            } else {
                process.send(null);
            }
            break;
        }
    }
});
