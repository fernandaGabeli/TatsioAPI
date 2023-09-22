const { Router } = require('express');
const router = Router();
const { getPostsByUserId, getPostsByCategoriesId, createPost, updatePost } = require('../controllers/postsController');

router.get('/:userId', getPostsByUserId);
router.get('/:categoriesId', getPostsByCategoriesId);
router.post('/', createPost);
router.put('/', updatePost);

module.exports = router;