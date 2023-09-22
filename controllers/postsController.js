const { request, response } = require("express");
const Post = require('../models/post');
const User = require("../models/user");
const Category = require("../models/category");

const getPostsByUserId = async (req = request, res = response) => {
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

const getPostsByCategoriesId = async (req = request, res = response) => {
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

const updatePost = async (req = request, res = response) => {
    try {
        const { userId, title, subtitle, images, categoryId, id } = req.body;
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

        if (!title) {
            return res.status(400).json({ message: "Title is required." });
        }

        if (!categoryId) {
            return res.status(400).json({ message: "CategoryId is required." });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: "CategoryId not valid or category does not exists." });
        }

        post.title = title;
        post.subtitle = subtitle;
        post.images = images;
        post.categoryId = categoryId;
        await Post.updateOne({ _id: id }, post);
        return res.status(201).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const createPost = async (req = request, res = response) => {
    try {
        const { userId, title, subtitle, images, categoryId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "UserId not valid or user does not exists." });
        }

        if (!title) {
            return res.status(400).json({ message: "Title is required." });
        }

        if (!categoryId) {
            return res.status(400).json({ message: "CategoryId is required." });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: "CategoryId not valid or category does not exists." });
        }

        const newPost = new Post({
            title,
            subtitle,
            author: {
                userId,
                userProfilePhoto: user.profilePhoto
            },
            images,
            categoryId
        });
        const savedPost = await Post.create(newPost);
        return res.status(201).json(savedPost);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

module.exports = {
    getPostsByUserId,
    getPostsByCategoriesId,
    createPost,
    updatePost
}