import { IncomingMessage, ServerResponse } from "http";
// NOTE - 跨網域設定
import headers from "./headers";
import { IPost } from "../models/posts";

function successHandle(res: ServerResponse, massage: string | IPost[]): void {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      "status": "success",
      massage
    })
  )
  res.end();
}

export default successHandle;