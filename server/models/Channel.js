const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    channelName: String,
    imageUrl: String,
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
});

module.exports = mongoose.model('Channel', ChannelSchema);