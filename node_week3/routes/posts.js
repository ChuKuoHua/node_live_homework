const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');

/* GET home page. */
router.get('/', PostsControllers.getPosts);
router.post('/', PostsControllers.createPost);
router.delete('/', PostsControllers.deleteOnePost);
router.delete('/all', PostsControllers.deleteAllPost);
router.patch('/', PostsControllers.editPost);

module.exports = router;