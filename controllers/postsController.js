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

        return res.status(200).json(await Post.find({ 'author.userId': userId }));
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const getPostsByCategoriesId = async (req = request, res = response) => {
    try {
        let { categoriesId } = req.params;
        categoriesId = categoriesId.includes(",") ? categoriesId.split(",") : [categoriesId];
        if (!categoriesId || categoriesId.length <= 0) {
            return res.status(400).json({ message: "CategoriesId are required." });
        }

        return res.status(200).json(await Post.find({
            categoriesId: { $in: categoriesId }
        }));
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const getPosts = async (req = request, res = response) => {
    try {
        return res.status(200).json(await Post.find());
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const updatePost = async (req = request, res = response) => {
    try {
        const { name, age, images, categories, _id, description } = req.body;
        if (!_id) {
            return res.status(400).json({ message: "Id is required." });
        }

        const post = await Post.findById(_id);
        if (!post) {
            return res.status(400).json({ message: "PostId not valid or post does not exists." });
        }

        const categoriesId = await findOrCreateCategories(categories);

        post.name = name;
        post.age = age;
        post.images = images;
        post.categoriesId = categoriesId;
        post.description = description;
        await Post.updateOne({ _id }, post);
        return res.status(201).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, communicate with administrator" });
    }
};

const createPost = async (req = request, res = response) => {
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

const findOrCreateCategories = async (categories = []) => {
    return await Promise.all(categories.map(async (c) => {
        const category = await Category.findOne({ name: new RegExp(`^${c}$`, 'i') });
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
    updatePost,
    getPosts
}