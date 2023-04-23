const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const userControllers = require('../controllers/user');
const { isAuth } = require('../middleware/auth');

// 登入
router.post('/login', handleErrorAsync(userControllers.login));
// 註冊
router.post('/sign_up', handleErrorAsync(userControllers.register));
// 取得個人資訊
router.get('/profiles', isAuth, handleErrorAsync(userControllers.profile));
// 修改個人資訊
router.patch('/profiles', isAuth, handleErrorAsync(userControllers.updateProfile));
// 修改密碼
router.patch('/updatePassword', isAuth, handleErrorAsync(userControllers.updatePassword));

module.exports = router;
