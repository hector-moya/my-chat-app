const express = require('express');
const router = express.Router();
const { users } = require('../data/data.json'); // Import users array from data.js
const { createUser } = require('../helpers/userHelper');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', './data/data.json');

/**
 * GET /api/user
 * Get all users
 */
router.get('/', (req, res) => {
    try {
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
router.get('/:id', (req, res) => {
    try {
        // Validate the user ID parameter
        const userId = parseInt(req.params.id, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID parameter' });
        }

        // Find the user by ID
        const user = users.find(u => u.id === userId);

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
router.post('/', (req, res) => {
    const { username, email, password } = req.body;
    const { user, error } = createUser(username, email, password);

    if (error) {
        return res.status(400).json({ message: error });
    }
    // Read existing data
    const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Update the users field
    existingData.users = users;

    try {
        // Write the updated data back to the file
        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to add user." });
    }
}); //----- End of POST /

/**
 * PUT /api/user/:id
 * Update an existing user
 */
router.put('/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    for (const [key, value] of Object.entries(req.body)) {
        users[userIndex][key] = value;
    }

    const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    existingData.users = users;

    try {
        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        res.json(users[userIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user.' });
    }
}); //----- End of PUT /:id

/**
 * DELETE /api/user/:id
 * Delete a user by ID
 */
router.delete('/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    users.splice(userIndex, 1);

    const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    existingData.users = users;

    try {
        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
}); //----- End of DELETE /:id

module.exports = router;
