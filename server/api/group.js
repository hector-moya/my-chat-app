const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const Channel = require("../models/Channel");
const UserChannel = require("../models/UserChannel");
const Role = require("../models/Role");
const express = require("express");
const router = express.Router();

/**
 * Get all groups
 * This route will return an array of all groups
 */
router.get('/', async (req, res) => {
  try {
      const groups = await Group.find();
      if (groups && groups.length > 0) {
          return res.status(200).json(groups);
      } else {
          return res.status(404).json({ message: 'No groups found' });
      }
  } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
}); //----- End of GET /

/**
 * Get a group by ID
 * This route will return all groups that a user belongs to
 */
router.get('/byUser/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const userGroups = await UserGroup.find({ userId: userId });

      if (userGroups.length > 0) {
          const groupIds = userGroups.map(ug => ug.groupId);
          const groupsByUser = await Group.find({ _id: { $in: groupIds } });
          return res.status(200).json(groupsByUser);
      } else {
          return res.status(404).json({ message: 'No groups found for this user' });
      }
  } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
}); //----- End of GET /byUser/:userId

/**
 * Get a group by ID
 * 
 * This route will return a group object if found, or a 404 error if not found
 */
router.get('/userRole/:groupId/:userId', async (req, res) => {
  try {
      const { groupId, userId } = req.params;
      const userGroup = await UserGroup.findOne({ groupId: groupId, userId: userId });
      const role = await Role.findById(userGroup.roleId);

      if (role) {
          return res.status(200).json( role.roleName );
      } else {
          return res.status(404).json({ message: 'User group not found' });
      }
  } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * Add a group
 * 
 * This route will add a group to the groups array
 */
router.post('/', async (req, res) => {
    try {
      const newGroup = new Group(req.body.group);
      await newGroup.save();
  
      // Assign the user as an admin of the created group
      const role = await Role.findOne({ roleName: 'admin' });
      const userGroup = new UserGroup({
        userId: req.body.userId, // Assuming you have user info in req.user. If not, adjust this.
        groupId: newGroup._id,
        roleId: role._id
      });
      await userGroup.save();
  
      res.status(201).json(newGroup);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ message: 'Failed to add group.' });
    }
  }); //----- End of POST /

/**
 * Update a group
 * 
 * This route will update a group's details
 */
router.put("/:id", async (req, res) => {
  try {
      const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updatedGroup) {
          return res.status(200).json(updatedGroup);
      } else {
          return res.status(404).json({ message: "Group not found" });
      }
  } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ message: "Failed to update group." });
  }
}); //----- End of PUT /:id

/**
 * Delete a group
 * 
 * This route will delete a group from the groups array and remove all references to the group
 */
router.delete("/:id", async (req, res) => {
  try {
      const deletedGroup = await Group.findByIdAndDelete(req.params.id);
      if (deletedGroup) {
          // Remove related data
          await UserGroup.deleteMany({ groupId: req.params.id });
          await UserChannel.deleteMany({ groupId: req.params.id });
          await Channel.deleteMany({ groupId: req.params.id });
          return res.status(200).json({ message: "Group and related data deleted successfully." });
      } else {
          return res.status(404).json({ message: "Group not found" });
      }
  } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ message: "Failed to delete group and related data." });
  }
}); //----- End of DELETE /:id

/**
 * PUT /api/group/assignAdmin/:groupId/:userId
 * Assign a user as admin of a group
 */
router.put('/assignAdmin/:groupId/:userId', async (req, res) => {
  try {
      const userGroup = await UserGroup.findOne({ groupId: req.params.groupId, userId: req.params.userId });
      if (userGroup) {
          userGroup.roleName = 'admin'; 
          await userGroup.save();
          return res.status(200).json({ message: "User assigned as admin", userGroup });
      } else {
          return res.status(404).json({ message: "User or group not found" });
      }
  } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ message: "Failed to assign user as admin" });
  }
}); //----- End of PUT /assignAdmin/:groupId/:userId

module.exports = router;
