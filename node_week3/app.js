var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var postsRouter = require('./routes/posts');
var app = express();
require('./connections');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/posts', postsRouter);
// 處理無此路由
app.use((req, res, next) => res.status(404).send({
  status: 'error',
  massage: '無此網站路由'
}));

module.exports = app;
