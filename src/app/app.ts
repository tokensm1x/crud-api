import "dotenv/config";
import http from "http";
import { routes } from "./routes";

const PORT: number | string = process.env.PORT || 4000;

export const server = http.createServer(routes);

export function start(): void {
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}
