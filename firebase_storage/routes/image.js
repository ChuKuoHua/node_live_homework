const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const userControllers = require('../controllers/image');
const { isAuth } = require('../middleware/auth');
const upload = require('../service/image');

// 上傳圖片
router.post('/users/file', isAuth, upload, handleErrorAsync(userControllers.uploadUserImage));

module.exports = router;
