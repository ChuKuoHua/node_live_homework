const successHandle = require('../helpers/successHandle');
const { errHandle } = require('../helpers/errHandle');
const Post = require('../models/posts'
)

const posts = {
  // 查詢資料
  async getPosts({res, req}) {
    const data = await Post.find();
    successHandle(res, data);
  },
  // 建立資料
  async createPost({body, res, req}) {
    try {
      const data = body;
      
      const { name, tags, type, content, image } = data;
      const newPost = await Post.create({
        name,
        tags,
        type,
        content,
        image
      })
      successHandle(res, newPost)
    } catch (error) {
      console.log(error.errors);
      errHandle(res, error.errors);
    }
  },
  // 刪除單筆資料
  async deleteOnePost ({body, res, req}) {
    try {
      const id = body.id;
      await Post.findByIdAndDelete(id)
      successHandle(res, 'success')
    } catch {
      errHandle(res, '查無此 id');
    }
  },
  // 刪除全部資料
  async deleteAllPost ({res, req}) {
    const posts = await Post.deleteMany({});
    successHandle(res, posts)
  },
  // 編輯資料
  async editPost ({body, res, req}) {
    try {
      const data = body;
      const { id, content, image, likes, comments } = data;
      if(data) {
        const post = await Post.findByIdAndUpdate(id, {
          $set: {
            content,
            image,
            likes,
            comments
          }
        })
        successHandle(res, post)
      } else {
        errHandle(res, '欄位不正確')
      }
    } catch (err) {
      errHandle(res, '查無此 id');
    }
  },
}

module.exports = posts;