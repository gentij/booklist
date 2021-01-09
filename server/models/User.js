const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    books: [{
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        rating: {
            type: Number,
        },
        completed: {
            type: Boolean,
        },
        pages: {
            type: Number,
            required: true
        },
        pagesRead: {
            type: Number,
        },
    }]
})

module.exports = mongoose.model('User', userSchema);