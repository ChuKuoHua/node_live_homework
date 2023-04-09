const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const { resErrorProd, resErrorDev } = require('./service/resError');
const app = express();

require('./connections');
require('./service/processError');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/posts', postsRouter);
app.use('/api/user', userRouter);

// 處理無此路由
app.use((req, res, next) => res.status(404).send({
  status: 'error',
  massage: '無此路由資訊'
}));
// 錯誤處理
app.use(function(err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  } 
  // production
  if (err.name === 'ValidationError'){
    err.message = "資料欄位未填寫正確，請重新輸入！"
    err.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
});


module.exports = app;
