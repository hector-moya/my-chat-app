const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserGroup = require('../models/UserGroup');
const UserChannel = require('../models/UserChannel');
const Role = require('../models/Role');


// --------------------------------------------------------------------------------------------- //
// ---------------------- User Related APIs ---------------------------------------------------- //
// --------------------------------------------------------------------------------------------- //

/**
 * GET /api/user
 * Get all users
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        if (users && users.length > 0) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({ message: 'No users found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}); //----- End of Get all users

/**
 * GET /api/user/:id
 * Get a user by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}); //----- End of Get a user by ID

/**
 * POST /api/user
 * Create a new user
 */
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({
        userName: username,
        email: email,
        password: password
    });
    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to add user." });
    }
}); //----- End of POST /

/**
 * PUT /api/user/:id
 * Update an existing user
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (result) {
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
}); //----- End of PUT /:id

/**
 * PUT /api/user/updateRole/:id
 * Update user's role
 */
router.put('/updateRole/:id', async (req, res) => {
    try {
        const { isSuper } = req.body; // Destructure isSuper from request body
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { isSuper }, { new: true });
        if (updatedUser) {
            return res.status(200).json({ message: "User role updated", user: updatedUser });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user role.' });
    }
}); //----- End of PUT /promote/:id

// --------------------------------------------------------------------------------------------- //
// ---------------------- User Group Related APIs ---------------------------------------------- //
// --------------------------------------------------------------------------------------------- //

/**
 * GET /api/user/byGroup/:groupId
 * Get all users for a specific group
 */
router.get('/byGroup/:groupId', async (req, res) => {
    try {
        const userGroupAssociations = await UserGroup.find({ groupId: req.params.groupId }).exec();
        const userIds = userGroupAssociations.map(assoc => assoc.userId);
        const users = await User.find({ '_id': { $in: userIds } }).exec();

        // Map roles to users
        users.forEach(user => {
            const assoc = userGroupAssociations.find(a => a.userId.toString() === user._id.toString());
            user._doc.roleId = assoc.roleId; // Attach roleId to each user
        });

        if (users && users.length > 0) {
            return res.status(200).json(users);
        } else if (users && users.length === 0) {
            return res.status(200).json([]);
        } else {
            return res.status(404).json({ message: 'No users found for this group' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}); //----- End of Get all users for a specific group

// Get user by email
router.get('/byEmail/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        return res.status(200).json(user);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * API to add a user to a group
 * POST /api/user/addToGroup
 * @param {*} email
 */
router.post('/addToGroup', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        // Fetch the role's ObjectId using the roleName 'user'
        const role = await Role.findOne({ roleName: 'user' });
        if (!role) {
            return res.status(404).json({ message: `Role 'user' not found.` });
        }

        console.log('user:', user, 'user._id:', user._id, 'userName:', user.userName, 'roleId:', role.roleName);

        const newUserGroup = new UserGroup({
            userId: user._id,
            groupId: req.body.groupId,
            roleId: role._id // Use the fetched role's ObjectId
        });
        
        await newUserGroup.save();

        return res.status(200).json(user);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Failed to add user to the group.' });
    }
});

// Remove user from a group
router.delete('/removeFromGroup/:userId/:groupId', async (req, res) => {
    try {
        const { userId, groupId } = req.params;
        const result = await UserGroup.findOneAndDelete({ userId, groupId });
        if (result) {
            return res.status(200).json({ message: 'User removed from the group successfully.' });
        } else {
            return res.status(404).json({ message: 'User not found in the group.' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Failed to remove user from the group.' });
    }
});

/**
 * API to update user role in a group
 * PUT /api/user/updateRoleInGroup
 * @param {*} userId
 */
router.put('/updateRoleInGroup', async (req, res) => {
    try {
        const { userId, groupId, roleName } = req.body;

        // Get the role's ObjectId using the roleName
        const role = await Role.findOne({ roleName: roleName });
        if (!role) {
            return res.status(404).json({ message: `Role ${roleName} not found.` });
        }

        const userGroup = await UserGroup.findOne({ userId, groupId });
        if (!userGroup) {
            return res.status(404).json({ message: 'User-Group association not found.' });
        }

        userGroup.roleId = role._id;  // Use the fetched role's ObjectId
        await userGroup.save();

        return res.status(200).json({ message: 'User role updated successfully.' });
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Failed to update user role in the group.' });
    }
}); //----- End of PUT /updateRoleInGroup

/**
 * API to retrieve the role of a user in a group
 * GET /api/user/getRoleInGroup/:userId/:groupId
 */
router.get('/getRoleInGroup/:groupId/:userId', async (req, res) => {
    try {
        const { userId, groupId } = req.params;
        console.log('userId:', userId);
        console.log('groupId:', groupId);
        const userGroup = await UserGroup.findOne({ userId, groupId });
        if (!userGroup) {
            return res.status(404).json({ message: 'User-Group association not found.' });
        }
        console.log('userGroup:', userGroup);
        const role = await Role.findById(userGroup.roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found.' });
        }
        console.log('role:', role);
        return res.status(200).json(role);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Failed to fetch user role in the group.' });
    }
}); //----- End of GET /getRoleInGroup

// --------------------------------------------------------------------------------------------- //
// ---------------------- User Channel Related APIs -------------------------------------------- //
// --------------------------------------------------------------------------------------------- //

/**
 * GET /api/user/byChannel/:channelId
 * Get all users for a specific channel
 */
router.get('/byChannel/:channelId', async (req, res) => {
    try {
        // Step 1: Fetch the user-channel associations
        const userChannelAssociations = await UserChannel.find({ channelId: req.params.channelId }).exec();

        // Extract user IDs
        const userIds = userChannelAssociations.map(assoc => assoc.userId);

        // Step 2: Fetch user details using the user IDs
        const users = await User.find({ '_id': { $in: userIds } }).exec();

        if (users && users.length > 0) {
            return res.status(200).json(users);
        } else if (users && users.length === 0) {
            return res.status(200).json([]);
        } else {
            return res.status(404).json({ message: 'No users found for this channel' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add user to a channel
router.post('/addToChannel', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const newUserChannel = new UserChannel({
            userId: user._id,
            channelId: req.body.channelId
        });
        await newUserChannel.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Failed to add user to the channel.' });
    }
});

// Remove user from a channel
router.delete('/removeFromChannel/:userId/:channelId', async (req, res) => {
    try {
        const { userId, channelId } = req.params;
        const result = await UserChannel.findOneAndDelete({ userId, channelId });
        if (result) {
            return res.status(200).json({ message: 'User removed from the channel successfully.' });
        } else {
            return res.status(404).json({ message: 'User not found in the channel.' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ message: 'Failed to remove user from the channel.' });
    }
});

module.exports = router;
