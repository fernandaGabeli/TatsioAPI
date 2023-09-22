const mongoose = require('mongoose');
const { Author } = require('./author');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false,
        default: ''
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
    categoryId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;