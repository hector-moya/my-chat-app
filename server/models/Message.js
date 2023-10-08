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
});

module.exports = mongoose.model('Message', MessageSchema);