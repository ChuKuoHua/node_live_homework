import { ServerResponse, IncomingMessage } from "http";
import { notHandle } from "../helpers/errHandle";
import headers from "../helpers/headers";

interface Http {
  cors: (res: ServerResponse, req: IncomingMessage) => void;
  notFound: (res: ServerResponse, req: IncomingMessage) => void;
}

const http: Http = {
  cors(res: ServerResponse, req: IncomingMessage) {
    res.writeHead(200, headers);
    res.end();
  },
  notFound(res: ServerResponse, req: IncomingMessage) {
    notHandle(res, '無此網站路由');
    res.end();
  },
};

export default http;
