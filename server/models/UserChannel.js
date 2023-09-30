const mongoose = require('mongoose');

const UserChannelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
    },
});

module.exports = mongoose.model('UserChannel', UserChannelSchema);