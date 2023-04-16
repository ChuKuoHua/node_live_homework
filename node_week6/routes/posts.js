const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const PostsControllers = require('../controllers/posts');
const {isAuth} = require('../middleware/auth');
/* GET home page. */
router.get('/', handleErrorAsync(PostsControllers.getPosts));
router.post('/', isAuth, handleErrorAsync(PostsControllers.createPost));
router.delete('/', isAuth, handleErrorAsync(PostsControllers.deleteOnePost));
router.patch('/', isAuth, handleErrorAsync(PostsControllers.editPost));

module.exports = router;