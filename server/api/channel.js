const Channel = require('../models/Channel');
const UserChannel = require('../models/UserChannel');
const express = require('express');
const router = express.Router();

/**
 * Get all channels
 * This route will return an array of all channels
 */
router.get('/', async (req, res) => {
  try {
    const allChannels = await Channel.find();
    if (allChannels && allChannels.length > 0) {
      return res.status(200).json(allChannels);
    } else {
      return res.status(404).json({ message: 'No channels found' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}); //----- End of GET /

/**
 * Get a channel by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (channel) {
      return res.status(200).json(channel);
    } else {
      return res.status(404).json({ message: 'Channel not found' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}); //----- End of Get a channel by ID

/**
 * Get all channels for a user in a group
 * 
 * This route will return an array of all channels for a user in a group
 */
router.get("/byUser/:groupId/:userId", async (req, res) => {
  try {
    const userChannels = await UserChannel.find({
      userID: req.params.userId,
      groupID: req.params.groupId
    });

    if (userChannels && userChannels.length > 0) {
      const channelIds = userChannels.map(uc => uc.channelID);
      const channelDetails = await Channel.find({ '_id': { $in: channelIds } });

      return res.status(200).json(channelDetails);
    } else {
      return res.status(404).json({ message: "No channels found for this user and group" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}); //----- End of GET /byUser/:groupId/:userId

/**
 * Post a new channel
 * This route will create a new channel and add it to the channels array
 */
router.post("/", async (req, res) => {
  const newChannel = new Channel(req.body);
  try {
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    console.error("Failed to add channel:", error);
    res.status(500).json({ message: "Failed to add channel." });
  }
}); //----- End of POST /


/**
 * Update a channel
 * This route will update a channel's details
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedChannel = await Channel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedChannel) {
      res.status(200).json(updatedChannel);
    } else {
      res.status(404).json({ message: "Channel not found" });
    }
  } catch (error) {
    console.error("Failed to update channel:", error);
    res.status(500).json({ message: "Failed to update channel." });
  }
}); //----- End of PUT /:id


/**
 * Delete a channel
 * This route will delete a channel
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedChannel = await Channel.findByIdAndRemove(req.params.id);
    if (deletedChannel) {
      res.status(200).json({ message: "Channel deleted successfully." });
    } else {
      res.status(404).json({ message: "Channel not found" });
    }
  } catch (error) {
    console.error("Failed to delete channel:", error);
    res.status(500).json({ message: "Failed to delete channel." });
  }
}); //----- End of DELETE /:id

module.exports = router;
