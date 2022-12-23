import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";
import { routes } from "./routes";
import cluster from "cluster";
import { cpus } from "os";
import { usersDbPath } from "../in-memory-db/get-users-db";
import { writeFile } from "fs/promises";
import url from "url";
import { loadBalancer } from "./load-balancer";

const PORT: number = +process.env.PORT || 4000;
const primaryServer = http.createServer();
const workerServer = http.createServer(routes);

export function start(): void {
    const args: any = process.argv.slice(2).reduce((acc: any, el) => {
        acc[el] = true;
        return acc;
    }, {});

    if (args["--multi"]) {
        if (cluster.isPrimary) {
            const cpusAmount: number = cpus().length;
            let i = 1;
            primaryServer
                .listen(PORT, () => {
                    console.log(`Load Balancer server running at http://localhost:${PORT}/`);
                })
                .on("request", (req: IncomingMessage, res: ServerResponse) => {
                    const options = {
                        host: "localhost",
                        port: PORT + i++,
                        path: req.url,
                        method: req.method,
                        headers: req.headers,
                    };
                    loadBalancer(req, res, options);
                    if (i === cpusAmount + 1) {
                        i = 1;
                    }
                });

            for (let i = 0; i < cpusAmount; i++) {
                cluster.fork({ WORKER_PORT: PORT + i + 1 });
            }

            cluster.on("exit", (worker) => {
                console.log(`worker ${worker.process.pid} died`);
            });
        } else {
            const PORT = +process.env.WORKER_PORT;
            workerServer
                .listen(PORT, () => {
                    console.log(`Worker ${process.pid} server running at http://localhost:${PORT}/`);
                })
                .on("request", () => {
                    console.log(workerServer.address());
                });
        }
    } else {
        workerServer.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/`);
        });
    }

    process.on("SIGINT", async () => {
        try {
            await writeFile(usersDbPath, JSON.stringify([]));
        } catch (error) {
            console.log(error);
        }
        workerServer.close();
        primaryServer.close();
        process.exit();
    });
}
