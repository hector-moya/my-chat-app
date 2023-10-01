const express = require('express');
const router = express.Router();
const User = require('../models/User');

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
});
 //----- End of Get a user by ID

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

module.exports = router;
