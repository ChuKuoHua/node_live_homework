import { IncomingMessage, ServerResponse } from "http";
import routes from "./routes";
require('./connections');

const app = async (req: IncomingMessage, res: ServerResponse) => {
  routes(req, res);
};

export default app;