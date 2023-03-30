const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const DATABASE = process.env.DATABASE || '';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';

const DB = DATABASE.replace(
  '<PASSWORD>',
  DATABASE_PASSWORD
)
// 連接資料庫
mongoose.connect(DB)
  .then(() => console.log('資料庫連線成功'))
  .catch((error: Error) => console.log(error));