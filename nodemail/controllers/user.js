const successHandle = require('../service/successHandle');
const { generateSendJWT } = require('../middleware/auth');
const appError = require('../service/appError');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const regex = /^(?=.*[a-z])(?=.*[A-Z])/;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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
        status: "0" // 0 啟用 1 停用
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
    const { username, role } = req.user
    const data = {
      id: req.user.id,
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
  // 忘記密碼寄信
  async forgotPassword (req, res, next) {
    const { email } = req.body;
    // 密碼 8 碼以上
    const user = await User.findOne(
      {
        email
      }
    );

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn: '1d'
    });
    if(!user) {
      return next(appError("400","無此會員信箱",next));
    }
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.ACCOUNT,
        clientId: process.env.CLINENTID,
        clientSecret: process.env.CLINENTSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: process.env.ACCESSTOKEN,
      },
      tls: {
        rejectUnauthorized: false // 忽略憑證錯誤
      }
    });
    const mailOptions = {
      form: process.env.ACCOUNT,
      to : email,
      subject: 'musitix 重設密碼連結',
      html: `
      <p>親愛的 musitix 會員您好</p>
      <p>您收到這封郵件是因為我們收到了您重設密碼的請求。</p>
      <p>若您確定要重設密碼，請點擊以下連結：</p>
      <a
        href="http://127.0.0.1:3000/${token}"
        style="
          background-color: #111211;
          border: none;
          color: white;
          padding: 10px 15px;
          text-decoration: none;
          cursor: pointer;
          border-radius: 5px;
          font-size: 14px;
        "
      >密碼重設</a>
      <p>此連結將會帶您前往密碼重設頁面。如果您未發出此請求，請忽略此郵件，您的密碼不會有任何更改。</p>
      <p>謝謝！</p>
      <p>musitix 活動主辦方</p>
      `
    }
    transporter.sendMail(mailOptions,function(error,info){
      console.log(error,info);
      if(error){
        return console.log(error);
      }
      successHandle(res, '寄信成功')
    })
  },
}

module.exports = user;