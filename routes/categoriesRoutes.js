const { Router } = require('express');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoriesController');
const { validateJWT } = require('../middlewares');
const router = Router();

router.get("/", [validateJWT], getCategories);
router.post("/", [validateJWT], createCategory);
router.post("/:categoryId", [validateJWT], deleteCategory);

module.exports = router;