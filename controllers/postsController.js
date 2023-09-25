const { request, response } = require("express");
const Post = require('../models/post');
const User = require("../models/user");
const Category = require("../models/category");

const getPostsByUserId = async(req = request, res = response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required." });
        }

        return await Post.find({ author: { userId } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const getPostsByCategoriesId = async(req = request, res = response) => {
    try {
        const { categoriesId } = req.params;
        if (!categoriesId || categoriesId.length <= 0) {
            return res.status(400).json({ message: "CategoriesId are required." });
        }

        const filter = categoriesId.map(id => ({ categoryId: id }));
        return await Post.find({ $or: filter });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const updatePost = async(req = request, res = response) => {
    try {
        const { userId, name, age, images, categories, id, description } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Id is required." });
        }

        const post = await Post.findById(userId);
        if (!post) {
            return res.status(400).json({ message: "PostId not valid or post does not exists." });
        }

        if (!userId) {
            return res.status(400).json({ message: "UserId is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "UserId not valid or user does not exists." });
        }

        const categoriesId = await findOrCreateCategories(categories);

        post.name = name;
        post.age = age;
        post.images = images;
        post.categoriesId = categoriesId;
        post.description = description;
        await Post.updateOne({ _id: id }, post);
        return res.status(201).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const createPost = async(req = request, res = response) => {
    try {
        const { userId, name, age, images, categories, description } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "UserId not valid or user does not exists." });
        }

        const categoriesId = await findOrCreateCategories(categories);

        const newPost = new Post({
            name,
            age,
            description,
            author: {
                userId,
                userProfilePhoto: user.profilePhoto
            },
            images,
            categoriesId
        });
        const savedPost = await Post.create(newPost);
        return res.status(201).json(savedPost);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const findOrCreateCategories = async(categories) => {
    return await Promise.all(categories.map(async(c) => {
        const category = await Category.findOne({ $where: { name: `/^${c}$/i` } });
        if (!category) {
            const newCategory = await Category.create(new Category({
                name: c
            }));

            return newCategory._id;
        }

        return category._id;
    }));
};

module.exports = {
    getPostsByUserId,
    getPostsByCategoriesId,
    createPost,
    updatePost
}