const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: [true, 'username is required']
    },
    password: {
        type:String,
        required: [true, 'password is required']
    }
});

module.exports = mongoose.model('User', userSchema);