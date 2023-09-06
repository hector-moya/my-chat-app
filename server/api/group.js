const { groups, user_group, channels, user_channel } = require("../data/data.json"); // Import users array from data.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "./data/data.json");

/**
 * Get all groups
 * This route will return an array of all groups
 */
router.get("/", (req, res) => {
  try {
    if (groups && groups.length > 0) {
      return res.status(200).json(groups);
    } else {
      return res.status(404).json({ message: "No groups found" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}); //----- End of GET /

/**
 * Get a group by ID
 * This route will return all groups that a user belongs to
 */
router.get("/byUser/:userId", (req, res) => {
  try {
    // Validate the user ID parameter
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID parameter" });
    }

    // Filter groups by user ID
    const userGroups = user_group
      .filter((ug) => ug.userID === userId)
      .map((ug) => ug.groupID);

    if (userGroups.length > 0) {
      const groupsByUser = groups.filter((g) => userGroups.includes(g.id));
      return res.status(200).json(groupsByUser);
    } else {
      return res.status(404).json({ message: "No groups found for this user" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}); //----- End of GET /byUser/:userId

/**
 * Get a group by ID
 * 
 * This route will return a group object if found, or a 404 error if not found
 */
router.get("/userRole/:groupId/:userId", (req, res) => {
  try {
    // Validate parameters
    const groupId = parseInt(req.params.groupId, 10);
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(groupId) || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    // Search for the user-group relationship
    const userGroup = user_group.find(
      (ug) => ug.userID === userId && ug.groupID === groupId
    );

    if (userGroup) {
      console.log('return role: ', { roleID: userGroup.roleID });
      return res.status(200).json({ roleID: userGroup.roleID });
    } else {
      return res.status(404).json({ message: "User group not found" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * Add a group
 * 
 * This route will add a group to the groups array
 */
router.post("/", (req, res) => {
  // Generate a new ID (assuming the last group in the list has the highest ID)
  const newId = groups.length > 0 ? Math.max(groups.map(g => g.id)) + 1 : 1;

  // Create a new group object
  const newGroup = {
    id: newId,
    ...req.body  // Spread operator to copy all properties from the request body
  };

  // Add the new group to the in-memory list
  groups.push(newGroup);

  // Read existing data
  const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Update the groups field
  existingData.groups = groups;

  try {
    // Write the updated data back to the file
    fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: "Failed to add group." });
  }
}); //----- End of POST /

/**
 * Update a group
 * 
 * This route will update a group's details
 */
router.put("/:id", (req, res) => {
  const groupId = parseInt(req.params.id, 10);
  const groupIndex = groups.findIndex((g) => g.id === groupId);

  if (groupIndex !== -1) {
    // Update the group details
    for (const [key, value] of Object.entries(req.body)) {
      groups[groupIndex][key] = value;
    }

    // Read existing data
    const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Update the groups field
    existingData.groups = groups;

    try {
      // Write the updated data back to the file
      fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
      res.status(200).json(groups[groupIndex]);
    } catch (error) {
      res.status(500).json({ message: "Failed to update group." });
    }
  } else {
    res.status(404).json({ message: "Group not found" });
  }
});
 //----- End of PUT /:id

/**
 * Delete a group
 * 
 * This route will delete a group from the groups array and remove all references to the group
 */
router.delete("/:id", (req, res) => {
  const groupId = parseInt(req.params.id, 10);
  const groupIndex = groups.findIndex((g) => g.id === groupId);

  if (groupIndex !== -1) {
    // Remove the group
    groups.splice(groupIndex, 1);

    // Remove all references in user_group
    const newUserGroup = user_group.filter(ug => ug.groupID !== groupId);

    // Identify all channelIDs that need to be deleted
    const channelIdsToDelete = user_channel
      .filter(uc => uc.groupID === groupId)
      .map(uc => uc.channelID);

    // Remove all these channels
    const newChannels = channels.filter(channel => !channelIdsToDelete.includes(channel.id));

    // Remove all references in user_channel
    const newUserChannel = user_channel.filter(uc => uc.groupID !== groupId);

    // Read existing data from the file
    const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Update the data
    existingData.groups = groups;
    existingData.user_group = newUserGroup;
    existingData.channels = newChannels;
    existingData.user_channel = newUserChannel;

    try {
      // Write the updated data back to the file
      fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
      res.status(200).json({ message: "Group and related data deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete group and related data." });
    }
  } else {
    res.status(404).json({ message: "Group not found" });
  }
}); //----- End of DELETE /:id



module.exports = router;
