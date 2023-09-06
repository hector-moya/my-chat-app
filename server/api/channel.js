const { channels, user_channel } = require('../data/data.json'); // Import channels array from data.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data.json');

// Get all channels
router.get('/', (req, res) => {
    res.json(channels);
});

// Get channels by channel ID
router.get('/:id', (req, res) => {
    const channelId = parseInt(req.params.id, 10);
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
        res.json(channel);
    } else {
        res.status(404).json({ message: 'Channel not found' });
    }
});

// Get channels by user ID and group ID

// Get the user's role for a group
router.get("/byUser/:groupId/:userId", (req, res) => {
  console.log("Inside /byUser/:groupId/:userId");
  const groupId = parseInt(req.params.groupId, 10);
  const userId = parseInt(req.params.userId, 10);

  console.log("groupId:", groupId, "userId:", userId);

  // Filter user_channel data based on userId and groupId
  const userChannels = user_channel.filter(
    (uc) => uc.userID === userId && uc.groupID === groupId
  );

    console.log("userChannels:", userChannels);
  if (userChannels.length > 0) {

    // Get the channel IDs for the user
    const channelIds = userChannels.map((uc) => uc.channelID);

    console.log("channelIds:", channelIds)
    // Fetch the channel data for the user
    const channelDetails = channels.filter(channel => channelIds.includes(channel.id));

    console.log("channelDetails:", channelDetails);
    res.json(channelDetails);
  } else {
    res
      .status(404)
      .json({ message: "No channels found for this user and group" });
  }
});

// Add a new channel
router.post('/', (req, res) => {
    const newChannel = {
        id: channels.length + 1,
        channelName: req.body.channelName,
    };
    channels.push(newChannel);
    res.status(201).json(newChannel);
});

// Update an existing channel
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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
