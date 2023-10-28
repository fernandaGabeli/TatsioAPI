const { Router } = require('express');
const router = Router();
const { getPostsByUserId, getPostsByCategoriesId, createPost, updatePost, getPosts } = require('../controllers/postsController');
const { validateJWT } = require('../middlewares');

router.get('/:userId', [validateJWT], getPostsByUserId);
router.get('/byCategories/:categoriesId', [validateJWT], getPostsByCategoriesId);
router.post('/', [validateJWT], createPost);
router.put('/', [validateJWT], updatePost);
router.get('/', [validateJWT], getPosts);

module.exports = router;