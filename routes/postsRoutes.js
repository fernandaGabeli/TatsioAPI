const { Router } = require('express');
const router = Router();
const { getPostsByUserId, getPostsByCategoriesId, createPost, updatePost } = require('../controllers/postsController');
const { validateJWT } = require('../middlewares');

router.get('/:userId', [validateJWT], getPostsByUserId);
router.get('/:categoriesId', [validateJWT], getPostsByCategoriesId);
router.post('/', [validateJWT], createPost);
router.put('/', [validateJWT], updatePost);

module.exports = router;