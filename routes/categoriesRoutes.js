const { Router } = require('express');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoriesController');
const router = Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.post("/:categoryId", deleteCategory);