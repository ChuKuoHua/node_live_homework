import express from 'express';
import { Router } from 'express';
const handleErrorAsync = require('../service/handleErrorAsync');
const PostsControllers = require('../controllers/posts');

const router: Router = express.Router();
/* GET home page. */
router.get('/', handleErrorAsync(PostsControllers.getPosts));
router.post('/', handleErrorAsync(PostsControllers.createPost));
router.delete('/', handleErrorAsync(PostsControllers.deleteOnePost));
router.delete('/all', handleErrorAsync(PostsControllers.deleteAllPost));
router.patch('/', handleErrorAsync(PostsControllers.editPost));

module.exports = router;