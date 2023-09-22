const { request, response } = require("express");
const Category = require("../models/category");

const getCategories = async (req = request, res = response) => {
    try {
        return await Category.find();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const createCategory = async (req = request, res = response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const categoryAlreadyExists = await Category.findOne({ name });
        if (categoryAlreadyExists) {
            return res.status(400).json({ message: "Category alredy exists" });
        }

        const newCategory = new Category({ name });
        const createdCategory = await Category.create(newCategory);
        return res.status(201).json(createdCategory);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const deleteCategory = async (req = request, res = response) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).json({ message: "CategoryId is required" });
        }

        await Category.deleteOne({ _id: id });
        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory
}