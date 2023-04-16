const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const userControllers = require('../controllers/user');
const {isAuth} = require('../middleware/auth');

/* GET home page. */
router.post('/sign_in', handleErrorAsync(userControllers.login));
router.post('/sign_up', handleErrorAsync(userControllers.register));
router.get('/profile', isAuth, handleErrorAsync(userControllers.profile));
router.patch('/updateProfile', isAuth, handleErrorAsync(userControllers.updateProfile));
router.patch('/updatePassword', isAuth, handleErrorAsync(userControllers.updatePassword));
// router.delete('/userUpdateStatus', isAuth, handleErrorAsync(userControllers.userUpdateStatus));

module.exports = router;