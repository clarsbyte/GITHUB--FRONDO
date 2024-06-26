const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports= mongoose.model('User', User)