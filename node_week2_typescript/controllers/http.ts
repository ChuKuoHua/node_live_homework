import { ServerResponse, IncomingMessage } from "http";
import { notHandle } from "../helpers/errHandle";
import headers from "../helpers/headers";

interface Http {
  cors: (req: IncomingMessage, res: ServerResponse) => void;
  notFound: (req: IncomingMessage, res: ServerResponse) => void;
}

const http: Http = {
  cors(req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, headers);
    res.end();
  },
  notFound(req: IncomingMessage, res: ServerResponse) {
    notHandle(res, '無此網站路由');
    res.end();
  },
};

export default http;
