const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const userControllers = require('../controllers/user');

/* GET home page. */
router.get('/', handleErrorAsync(userControllers.getUser));
router.post('/', handleErrorAsync(userControllers.createUser));
router.delete('/', handleErrorAsync(userControllers.deleteUser));
router.patch('/', handleErrorAsync(userControllers.editUser));

module.exports = router;