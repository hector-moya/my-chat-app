const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    isSuper: Boolean
});

module.exports = mongoose.model('User', UserSchema);