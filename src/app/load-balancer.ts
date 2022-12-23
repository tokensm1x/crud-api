import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import http from "http";

interface IRequestOptions {
    host: string;
    port: number;
    path: string | any;
    method: string | any;
    headers: IncomingHttpHeaders;
}

export const loadBalancer = (req: IncomingMessage, res: ServerResponse, options: IRequestOptions) => {
    const proxy = http.request(options, (response: any) => {
        res.writeHead(response.statusCode, response.headers);
        response.pipe(res);
    });

    req.pipe(proxy);
};
