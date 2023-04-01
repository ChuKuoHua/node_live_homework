const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');const app = express();
require('./connections');

app.use(cors())
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
  massage: '無此網站路由'
}));

module.exports = app;
