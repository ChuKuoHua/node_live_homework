const successHandle = require('../service/successHandle');
const errHandle = require('../service/errHandle');
const User = require('../models/users')

const user = {
  // 查詢資料
  async getUser(req, res) {
    const data = await User.find();
    successHandle(res, data);
  },
  // 建立資料
  async createUser(req, res) {
    try {
      const { body } = req;
      const newUser = await User.create({
        name: body.name,
        email: body.email,
        photo: body.photo
      })
      
      successHandle(res, newUser)
    } catch (error) {
      console.log(error.errors);
      errHandle(res, error.errors);
    }
  },
  // 刪除單筆資料
  async deleteUser (req, res) {
    try {
      const id = req.body.id;
      await User.findByIdAndDelete(id)
      successHandle(res, 'success')
    } catch {
      errHandle(res, '查無此 id');
    }
  },
  // 編輯資料
  async editUser (req, res) {
    try {
      const { body } = req;
      if(body) {
        await User.findByIdAndUpdate(body.id, {
          $set: {
            name: body.name,
            email: body.email,
            photo: body.photo
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

module.exports = user;