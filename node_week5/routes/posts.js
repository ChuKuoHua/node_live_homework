const express = require('express');
const router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const PostsControllers = require('../controllers/posts');
/* GET home page. */
router.get('/', handleErrorAsync(PostsControllers.getPosts));
router.post('/', handleErrorAsync(PostsControllers.createPost));
router.delete('/', handleErrorAsync(PostsControllers.deleteOnePost));
router.delete('/all', handleErrorAsync(PostsControllers.deleteAllPost));
router.patch('/', handleErrorAsync(PostsControllers.editPost));

module.exports = router;