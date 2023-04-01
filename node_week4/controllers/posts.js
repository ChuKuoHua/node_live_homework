const successHandle = require('../service/successHandle');
const errHandle = require('../service/errHandle');
const Post = require('../models/posts')
const User = require('../models/users')

const posts = {
  // 查詢資料
  async getPosts(req, res) {
    // asc 遞增(由小到大，由舊到新) createdAt ; 
    // desc 遞減(由大到小、由新到舊) "-createdAt"
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt"
    const q = req.query.q !== undefined ? new RegExp(req.query.q)
    : {};
    // 模糊搜尋多欄位
    const data = await Post.find({
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
  async createPost(req, res) {
    try {
      const { body } = req;
      const newPost = await Post.create({
        user: body.userId,
        tags: body.tags,
        type: body.type,
        content: body.content,
        image: body.image
      })
      successHandle(res, newPost)
    } catch (error) {
      console.log(error.errors);
      errHandle(res, error.errors);
    }
  },
  // 刪除單筆資料
  async deleteOnePost (req, res) {
    try {
      const id = req.body.id;
      await Post.findByIdAndDelete(id)
      successHandle(res, 'success')
    } catch {
      errHandle(res, '查無此 id');
    }
  },
  // 刪除全部資料
  async deleteAllPost (req, res) {
    const posts = await Post.deleteMany({});
    successHandle(res, posts)
  },
  // 編輯資料
  async editPost (req, res) {
    try {
      const { body } = req;
      if(body) {
        await Post.findByIdAndUpdate(body.id, {
          $set: {
            content: body.content,
            image: body.image,
            likes: body.likes,
            comments: body.comments
          }
        })
        successHandle(res, 'success')
      } else {
        errHandle(res, '欄位不正確')
      }
    } catch (err) {
      errHandle(res, '查無此 id');
    }
  },
}

module.exports = posts;