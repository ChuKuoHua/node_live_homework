const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './.env'})

let DB = ''
if (process.env.NODE_ENV === 'development') {
  DB = 'mongodb://127.0.0.1:27017/hotel';
} else {
  DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  )
}

// 連接資料庫
mongoose.connect(DB)
  .then(() => console.log('資料庫連線成功'))
  .catch((error) => console.log(error));