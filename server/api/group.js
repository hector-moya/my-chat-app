const { groups, user_group } = require('../data/data'); // Import users array from data.js
const express = require('express');
const router = express.Router();

// Get all groups
router.get('/', (req, res) => {
    res.json(groups);
  });
  
  // Get groups by user ID
  router.get('/byUser/:userId', (req, res) => {
    console.log('hi');
    const userId = parseInt(req.params.userId, 10);
    console.log(userId);
    const userGroups = user_group.filter(ug => ug.userID === userId).map(ug => ug.groupID);
    console.log(userGroups);
  
    if (userGroups.length > 0) {
      const groupsByUser = groups.filter(g => userGroups.includes(g.id));
      res.json(groupsByUser);
    } else {
      res.status(404).json({ message: 'User not found or no groups for this user' });
    }
  });
  
  // Add a new group
  router.post('/', (req, res) => {
    const newGroup = {
      id: groups.length + 1,
      groupName: req.body.groupName,
    };
    groups.push(newGroup);
    res.status(201).json(newGroup);
  });
  
  // Update an existing group
  router.put('/:id', (req, res) => {
    const groupId = parseInt(req.params.id, 10);
    const group = groups.find(g => g.id === groupId);
  
    if (group) {
      group.groupName = req.body.groupName;
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  });
  
  // Delete a group
  router.delete('/:id', (req, res) => {
    const groupId = parseInt(req.params.id, 10);
    const groupIndex = groups.findIndex(g => g.id === groupId);
  
    if (groupIndex !== -1) {
      groups.splice(groupIndex, 1);
      res.json({ message: 'Group deleted successfully' });
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  });

module.exports = router;
