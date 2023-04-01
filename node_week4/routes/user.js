const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user');
/* GET home page. */
router.get('/', userControllers.getUser);
router.post('/', userControllers.createUser);
router.delete('/', userControllers.deleteUser);
router.patch('/', userControllers.editUser);

module.exports = router;