const mongoose = require('mongoose');
const { Author } = require('./author');

const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Author,
        required: true
    },
    images: {
        type: Array,
        required: true,
        default: []
    },
    isReported: {
        type: Boolean,
        required: true,
        default: false
    },
    categoriesId: {
        type: [String],
        required: true
    }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;