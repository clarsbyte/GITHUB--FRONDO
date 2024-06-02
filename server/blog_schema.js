const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const Blog = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    snippet:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    currentDate :{
        type: Date,
        default: Date.now
    }
})

module.exports= mongoose.model('Blog', Blog)