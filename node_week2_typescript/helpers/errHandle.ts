import { ServerResponse } from "http";
// NOTE - 跨網域設定
import headers from "./headers";

export function errHandle(res: ServerResponse, massage?: string): void {
  res.writeHead(400, headers);
  let msg: string = '';
  msg = massage ? massage : '欄位未填寫正確或無此 id';

  res.write(
    JSON.stringify({
      "status": "false",
      msg
    })
  )
  res.end();
}

export function notHandle(res: ServerResponse, massage: unknown): void {
  res.writeHead(404, headers);
  res.write(
    JSON.stringify({
      "status": "error",
      massage
    })
  )
  res.end();
}
