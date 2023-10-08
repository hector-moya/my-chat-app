const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message: String,    
    imageUrl: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
    },
    createdAt: Date,
    type: {
        type: String,
        enum: ['user', 'system'],  // Define the allowed values
        default: 'user'  // Default to 'user' for normal messages
      },
});

module.exports = mongoose.model('Message', MessageSchema);