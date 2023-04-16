const successHandle = require('../service/successHandle');
const { generateSendJWT } = require('../middleware/auth');
const appError = require('../service/appError');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const regex = /^(?=.*[a-z])(?=.*[A-Z])/;

const checkPwd = (pwd) => {
  if(pwd.length < 8 && !regex.test(pwd)) {
    return "密碼需大於 8 碼, 密碼需為一個大寫一個小寫英文跟數字組成"
  } else if(pwd.length < 8) {
    return "密碼需大於 8 碼"
  } else if(!regex.test(pwd)){
    return "密碼需為一個大寫一個小寫英文跟數字組成"
  }
}
const user = {
  // 登入
  async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError( 400,'帳號或密碼錯誤',next));
    }
    const user = await User.findOne(
      {
        email,
        status: "0"
      },
    ).select('+password');
    if(!user) {
      return next(appError( 400,'無此帳號或已禁用',next));
    }
    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
      return next(appError(400,'您的密碼不正確',next));
    }
  
    generateSendJWT(user,200,res);
  },
  // 註冊
  async register(req, res, next) {
    let { email, username, password, confirmPassword } = req.body;
    const errorMsg = []
    // 內容不可為空
    if(!email||!password||!confirmPassword||!username){
      return next(appError(400, "欄位未填寫正確！", next));
    }
    // 密碼檢查
    const pwdError = checkPwd(password)
    if(pwdError) {
      errorMsg.push(pwdError)
    }
    // 是否為 Email
    if(!validator.isEmail(email)){
      errorMsg.push("Email 格式不正確")
    }
    console.log(errorMsg);
    if(errorMsg.length > 0) {
      return next(appError(400, errorMsg, next));
    }
    // 確認密碼
    
    if(password !== confirmPassword){
      return next(appError(400,"密碼不一致！", next));
    }
    // 檢查信箱是否已使用(使用資料庫檢查)
    // const userCheck = await User.findOne({
    //   "email": email
    // })

    // if(userCheck !== null) {
    //   return next(appError(400,"此 Email 已使用",next));
    // }
    try {
      // 加密密碼
      password = await bcrypt.hash(req.body.password,12);
      const newUser = await User.create({
        email,
        password,
        username
      });
      generateSendJWT(newUser, 201, res);
    } catch (error) {
      // 不打資料庫，使用 mongoose 回傳的錯誤檢查  
      if(error instanceof Error && error.code === 11000) {
        return next(appError(400,"此 Email 已使用",next));
      }
    }
  },
  // 取得個人資料
  async profile(req, res) {
    const { id, username, role } = req.user
    const data = {
      id,
      username,
      role
    }

    successHandle(res, data);
  },
  // 更新個人資料
  async updateProfile (req, res, next) {
    const { username, gender} = req.body;
    const errorMsg = []
    if(!username) {
      errorMsg.push("暱稱不得為空值");
    }
    if(!gender) {
      errorMsg.push("請選擇性別");
    }
    if(errorMsg.length > 0) {
      return next(appError("400", errorMsg, next));
    }

    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        username: username,
        gender: gender
      }
    })
    successHandle(res, '修改成功')
  },
  // 更新密碼
  async updatePassword (req, res, next) {
    const { password,confirmPassword } = req.body;
    // 密碼 8 碼以上
    let errorMsg = checkPwd(password);
    if(errorMsg) {
      return next(appError("400", errorMsg, next));
    }
    if(password !== confirmPassword){
      return next(appError("400","密碼不一致！",next));
    }
    newPassword = await bcrypt.hash(password,12);
    
    const user = await User.findByIdAndUpdate(req.user.id,
      {
        password: newPassword
      }
    );
    generateSendJWT(user,200,res)
  },
  // 會員停用/啟用
  // async userUpdateStatus (req, res, next) {
  //   let msg = ''
  //   await User.findByIdAndUpdate(req.user.id, {
  //     status: req.body.status
  //   });

  //   if(req.body.status === '1') {
  //     msg = '會員已停用'
  //   } else {
  //     msg = '會員已啟用'
  //   }
  //   successHandle(res, msg)
  // },
}

module.exports = user;