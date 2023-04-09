const successHandle = require('../service/successHandle');
const User = require('../models/users')
const appError = require('../service/appError');
const validator = require('validator');

const user = {
  // 查詢資料
  async getUser(req, res) {
    const data = await User.find();
    successHandle(res, data);
  },
  // 建立資料
  async createUser(req, res, next) {
      const { name, email, photo } = req.body;
      const userCheck = await User.findOne({
        "email": email
      })
      if(userCheck) {
        return next(appError("400","此 Email 已使用",next));
      }

      if(!name || !email) {
        return next(appError("400","欄位未填寫正確！",next));
      }

      if(!validator.isEmail(email)){
        return next(appError("400","Email 格式不正確",next));
      }

      const newUser = await User.create({
        name: name,
        email: email,
        photo: photo
      })
      successHandle(res, newUser)
  },
  // 刪除單筆資料
  async deleteUser (req, res, next) {
    const id = req.body.id;
    const userCheck = await User.findOne({
      "_id": id
    })
    if (!userCheck) {
      return next(appError("400","查無此 id",next));
    }

    await User.findByIdAndDelete(id)
    successHandle(res, 'success')
  },
  // 編輯資料
  async editUser (req, res, next) {
      const { name, email, photo, id } = req.body;
      console.log(id);
      const userCheck = await User.findOne({
        "_id": id
      })
      if (userCheck === null) {
        return next(appError("400","查無此 id",next));
      }

      if(!name || !email) {
        return next(appError("400","欄位未填寫正確！",next));
      }

      if(!validator.isEmail(email)){
        return next(appError("400","Email 格式不正確",next));
      }
      await User.findByIdAndUpdate(id, {
        $set: {
          name: name,
          email: email,
          photo: photo
        }
      })
      successHandle(res, 'success')
  },
}

module.exports = user;