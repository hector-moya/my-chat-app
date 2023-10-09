const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  imageUrl: String,
  bio: String,
  status: {
    type: String,
    enum: ["pending", "user", "super"],
    default: "pending",
  },
});

module.exports = mongoose.model('User', UserSchema);