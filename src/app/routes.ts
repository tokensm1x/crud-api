import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { ERR_RESOURCE_NOT_FOUND } from "./errors";
import { UserController } from "../controllers/user-controller";
import { UserService } from "../services/users-service";

const usersService = new UserService();
const usersController = new UserController(usersService);

export function routes(req: IncomingMessage, res: ServerResponse) {
    try {
        res.setHeader("Content-Type", "application/json");
        const data: Uint8Array[] = [];

        req.on("data", (chunk) => {
            data.push(chunk);
        });

        req.on("end", async () => {
            const path: string = url.parse(req.url, true).pathname;
            const [apiUrl, usersUrl, id, ...params]: string[] = path.split("/").filter((el) => el);
            const reqUrl = `${apiUrl}/${usersUrl}`;

            if (reqUrl === "api/users" && !params.length) {
                let status: number = 200;
                let result: any;
                const body = data.length ? JSON.parse(Buffer.concat(data).toString()) : {};
                try {
                    switch (req.method) {
                        case "POST": {
                            result = await usersController.createUser();
                            break;
                        }
                        default: {
                            result = "NOT POST";
                        }
                    }
                    res.writeHead(status);
                    res.end(JSON.stringify(result));
                } catch (e) {
                    res.writeHead(400);
                    res.end(
                        JSON.stringify({
                            code: 400,
                            message: "ERROR",
                        })
                    );
                }
            } else {
                res.writeHead(404);
                res.end(
                    JSON.stringify({
                        code: 404,
                        message: ERR_RESOURCE_NOT_FOUND,
                    })
                );
            }
        });
    } catch (e) {
        res.writeHead(400);
        res.end(
            JSON.stringify({
                code: 400,
                message: "Something went wrong",
            })
        );
    }
}
