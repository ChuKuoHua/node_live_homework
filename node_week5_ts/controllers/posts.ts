import { Request, Response, NextFunction } from 'express';
import Post, { IPost } from '../models/posts';
const successHandle = require('../service/successHandle');
const appError = require('../service/appError');
// const Post = require('../models/posts')
const User = require('../models/users')
const posts = {
  // 查詢資料
  async getPosts(req: Request, res: Response) {
    // asc 遞增(由小到大，由舊到新) createdAt ; 
    // desc 遞減(由大到小、由新到舊) "-createdAt"
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt"
    const q: RegExp | {} = req.query.q !== undefined && typeof req.query.q === "string" ? new RegExp(req.query.q)
    : {};
    // 模糊搜尋多欄位
    const data: IPost[] = await Post.find({
      $or: [
        { type: {$in: [q] } },
        { content: { $regex: q } },
      ]
    }).populate({
      path: "user",
      select: "name photo"
    }).sort(timeSort)

    successHandle(res, data);
  },
  // 建立資料
  async createPost(req: Request, res: Response, next: NextFunction) {
    const { userId, tags, type, content, image } = req.body;
    const userCheck = await User.findOne({
      "_id": userId
    })
    if(!userCheck) {
      return next(appError("400","無此 id",next));
    }
    if(!content) {
      return next(appError("400","請輸入內容",next));
    }
    const newPost = await Post.create({
      user: userId,
      tags: tags,
      type: type,
      content: content,
      image: image
    })
    successHandle(res, newPost)
  },
  // 刪除單筆資料
  async deleteOnePost (req: Request, res: Response, next: NextFunction) {
      const id = req.body.id;
      const postCheck = await Post.findOne({
        "_id": id
      })
      if(!postCheck) {
        return appError("400","無此 id",next);
      }
      await Post.findByIdAndDelete(id)
      successHandle(res, 'success')
  },
  // 刪除全部資料
  async deleteAllPost (req: Request, res: Response) {
    const posts = await Post.deleteMany({});
    successHandle(res, posts)
  },
  // 編輯資料
  async editPost (req: Request, res: Response, next: NextFunction) {
    const { id, content, image, likes, comments } = req.body;
    const postCheck = await Post.findOne({
      "_id": id
    })

    if(!postCheck) {
      return next(appError("400","無此訂單",next));
    }

    if(!content) {
      return next(appError("400","請輸入內容",next));
    }

    await Post.findByIdAndUpdate(id, {
      $set: {
        content: content,
        image: image,
        likes: likes ? likes : 0,
        comments: comments ? comments : 0
      }
    })
    successHandle(res, 'success')
  },
}

module.exports = posts;