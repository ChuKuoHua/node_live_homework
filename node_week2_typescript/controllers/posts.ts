import { ServerResponse, IncomingMessage } from "http";
import successHandle from "../helpers/successHandle";
import { errHandle } from "../helpers/errHandle";
import Post, { IPost } from "../models/posts";

const posts = {
  // 查詢資料
  async getPosts(req: IncomingMessage, res:ServerResponse) {
    const data: IPost[] = await Post.find();
    successHandle(res, data);
  },
  // 建立資料
  async createPost(req: IncomingMessage, res:ServerResponse, body: string) {
    try {
      const data = <IPost>JSON.parse(body);
      const { name, tags, type, content, image } = data;
      await Post.create({
        name,
        tags,
        type,
        content,
        image
      })
      successHandle(res, "success")
    } catch (error: unknown) {
      console.log(error);
      errHandle(res, '建立失敗');
    }
  },
  // 刪除單筆資料
  async deleteOnePost (req: IncomingMessage, res:ServerResponse, body: string) {
    try {
      const id = <IPost>JSON.parse(body).id;
      await Post.findByIdAndDelete(id)
      successHandle(res, 'success')
    } catch {
      errHandle(res, '查無此 id');
    }
  },
  // 刪除全部資料
  async deleteAllPost (req: IncomingMessage, res:ServerResponse,) {
    await Post.deleteMany({});
    successHandle(res, "success")
  },
  // 編輯資料
  async editPost (req: IncomingMessage, res:ServerResponse, body: string) {
    try {
      const data = <IPost>JSON.parse(body);;
      const { id, content, image, likes, comments } = data;
      if(data) {
        await Post.findByIdAndUpdate(id, {
          $set: {
            content,
            image,
            likes,
            comments
          }
        })
        successHandle(res, "success")
      } else {
        errHandle(res, '欄位不正確')
      }
    } catch (err) {
      errHandle(res, '查無此 id');
    }
  },
}

export default posts;