const { channels, user_channel } = require('../data/data.json'); // Import channels array from data.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', './data/data.json');

/**
 * Get all channels
 * This route will return an array of all channels
 */
router.get('/', (req, res) => {
    try {
        if (channels && channels.length > 0) {
            return res.status(200).json(channels);
        } else {
            return res.status(404).json({ message: 'No channels found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * Get a channel by ID
 */
router.get('/:id', (req, res) => {
    try {
        // Validate the channel ID parameter
        const channelId = parseInt(req.params.id, 10);
        
        if (isNaN(channelId)) {
            return res.status(400).json({ message: 'Invalid channel ID parameter' });
        }

        // Find the channel by ID
        const channel = channels.find(c => c.id === channelId);

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
router.get("/byUser/:groupId/:userId", (req, res) => {
    try {
      // Validate and Parse the group and user IDs
      const groupId = parseInt(req.params.groupId, 10);
      const userId = parseInt(req.params.userId, 10);
  
      if (isNaN(groupId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid group or user ID" });
      }
  
      // Filter user_channel data based on userId and groupId
      const userChannels = user_channel.filter(
        (uc) => uc.userID === userId && uc.groupID === groupId
      );
  
      if (userChannels && userChannels.length > 0) {
        // Extract the channel IDs associated with the user
        const channelIds = userChannels.map((uc) => uc.channelID);
  
        // Fetch the corresponding channel details
        const channelDetails = channels.filter((channel) =>
          channelIds.includes(channel.id)
        );
  
        return res.status(200).json(channelDetails);
      } else {
        return res
          .status(404)
          .json({ message: "No channels found for this user and group" });
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
router.post("/", (req, res) => {
    // Generate a new ID (assuming the last channel in the list has the highest ID)
    const newId = channels.length > 0 ? Math.max(channels.map(c => c.id)) + 1 : 1;
  
    // Create a new channel object
    const newChannel = {
      id: newId,
      ...req.body  // Spread operator to copy all properties from the request body
    };
  
    // Add the new channel to the in-memory list
    channels.push(newChannel);
  
    // Read existing data
    const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
    // Update the channels field
    existingData.channels = channels;
  
    try {
      // Write the updated data back to the file
      fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
      res.status(201).json(newChannel);
    } catch (error) {
      res.status(500).json({ message: "Failed to add channel." });
    }
  }); //----- End of POST /
  

/**
 * Update a channel
 * This route will update a channel's details
 */
router.put("/:id", (req, res) => {
    const channelId = parseInt(req.params.id, 10);
    const channelIndex = channels.findIndex((c) => c.id === channelId);
  
    if (channelIndex !== -1) {
      // Update the channel details
      for (const [key, value] of Object.entries(req.body)) {
        channels[channelIndex][key] = value;
      }
  
      // Read existing data
      const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
      // Update the channels field
      existingData.channels = channels;
  
      try {
        // Write the updated data back to the file
        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        res.status(200).json(channels[channelIndex]);
      } catch (error) {
        res.status(500).json({ message: "Failed to update channel." });
      }
    } else {
      res.status(404).json({ message: "Channel not found" });
    }
  }); //----- End of PUT /:id
  

/**
 * Delete a channel
 * This route will delete a channel
 */
router.delete("/:id", (req, res) => {
    const channelId = parseInt(req.params.id, 10);
    const channelIndex = channels.findIndex((c) => c.id === channelId);
  
    if (channelIndex !== -1) {
      // Remove the channel from the in-memory list
      channels.splice(channelIndex, 1);
  
      // Read existing data
      const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
      // Update the channels field
      existingData.channels = channels;
  
      try {
        // Write the updated data back to the file
        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        res.status(200).json({ message: "Channel deleted successfully." });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete channel." });
      }
    } else {
      res.status(404).json({ message: "Channel not found" });
    }
  }); //----- End of DELETE /:id
  

module.exports = router;
