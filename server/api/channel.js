const { channels, user_channel } = require('../data/data.json'); // Import channels array from data.js
const express = require('express');
const router = express.Router();

// Get all channels
router.get('/channels', (req, res) => {
    res.json(channels);
});

// Get channels by user ID
router.get('/channels/byUser/:userId', (req, res) => {
    console.log('hi');
    const userId = parseInt(req.params.userId, 10);
    console.log(userId);
    const userChannels = user_channel.filter(uc => uc.userID === userId).map(uc => uc.channelID);
    console.log(userChannels);

    if (userChannels.length > 0) {
        const channelsByUser = channels.filter(c => userChannels.includes(c.id));
        res.json(channelsByUser);
    } else {
        res.status(404).json({ message: 'User not found or no channels for this user' });
    }
});

// Add a new channel
router.post('/channels', (req, res) => {
    const newChannel = {
        id: channels.length + 1,
        channelName: req.body.channelName,
    };
    channels.push(newChannel);
    res.status(201).json(newChannel);
});

// Update an existing channel
router.put('/channels/:id', (req, res) => {
    const channelId = parseInt(req.params.id, 10);
    const channel = channels.find(c => c.id === channelId);

    if (channel) {
        channel.channelName = req.body.channelName;
        res.json(channel);
    } else {
        res.status(404).json({ message: 'Channel not found' });
    }
});

// Delete a channel
router.delete('/channels/:id', (req, res) => {
    const channelId = parseInt(req.params.id, 10);
    const channelIndex = channels.findIndex(c => c.id === channelId);

    if (channelIndex !== -1) {
        channels.splice(channelIndex, 1);
        res.json({ message: 'Channel deleted successfully' });
    } else {
        res.status(404).json({ message: 'Channel not found' });
    }
});

module.exports = router;
