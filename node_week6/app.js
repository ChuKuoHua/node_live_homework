const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const { resAllError } = require('./middleware/resError');
const notFound = require('./service/notFound');
const app = express();

require('./connections');
require('./middleware/processError');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/posts', postsRouter);
app.use('/api/users', userRouter);

// 檢查路由
app.use(notFound);

// 錯誤處理
app.use(resAllError);


module.exports = app;
