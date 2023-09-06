const { groups, user_group } = require("../data/data.json"); // Import users array from data.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data.json");

// Get all groups
router.get("/", (req, res) => {
  res.json(groups);
});

// Get groups by user ID
router.get("/byUser/:userId", (req, res) => {
  console.log("User group array:", user_group);
  const userId = parseInt(req.params.userId, 10);
  console.log('userId: ', userId);
  const userGroups = user_group
    .filter((ug) => ug.userID === userId)
    .map((ug) => ug.groupID);
  console.log('Groups by user:', userGroups);

  if (userGroups.length > 0) {
    const groupsByUser = groups.filter((g) => userGroups.includes(g.id));
    res.json(groupsByUser);
  } else {
    res
      .status(404)
      .json({ message: "User not found or no groups for this user" });
  }
});

// Get the user's role for a group
router.get("/userRole/:groupId/:userId", (req, res) => {
  console.log('Inside /userRole/:groupId/:userId');
  const groupId = parseInt(req.params.groupId, 10);
  const userId = parseInt(req.params.userId, 10);
  console.log('groupId:', groupId, 'userId:', userId);
  const userGroup = user_group.find(
    (ug) => ug.userID === userId && ug.groupID === groupId
  );
  if (userGroup) {
    res.json(userGroup.roleID);
  } else {
    res.status(404).json({ message: "User group not found" });
  }
});

// Add a new group
router.post("/", (req, res) => {
  const newGroup = {
    id: groups.length + 1,
    groupName: req.body.groupName,
  };
  groups.push(newGroup);
  res.status(201).json(newGroup);
});

// Update an existing group
router.put("/:id", (req, res) => {
  const groupId = parseInt(req.params.id, 10);
  const group = groups.find((g) => g.id === groupId);

  if (group) {
    group.groupName = req.body.groupName;
    res.json(group);
  } else {
    res.status(404).json({ message: "Group not found" });
  }
});

// Delete a group
router.delete("/:id", (req, res) => {
  const groupId = parseInt(req.params.id, 10);
  const groupIndex = groups.findIndex((g) => g.id === groupId);
  console.log("groupId:", groupId);
  console.log("groupIndex:", groupIndex);
  if (groupIndex !== -1) {
    groups.splice(groupIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify({ groups }));
    return true;
  } else {
    res.status(404).json({ message: "Group not found" });
    return false;
  }
});

module.exports = router;
