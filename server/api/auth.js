const express = require('express');
const router = express.Router();
const { users } = require('../data/data'); // Import users array from data.js
const { createUser } = require('../helpers/userHelper');

/**
 * POST /api/auth
 * Authenticate user and respond with user object
 * @param {string} email
 * @param {string} password
 * @returns {object} user
 * @returns {boolean} valid
 */
router.post('/', (req, res) => {
    const { email, password } = req.body;
    const { user, error } = createUser(username, email, password);

    if (error) {
        return res.status(400).json({ message: error });
    }

    return res.status(201).json(user);
});

/**
 * POST /api/auth/register
 * Register a new user
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {object} user
 */
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Check if the email or username is already in use
    const existingUser = users.find(u => u.email === email || u.username === username);

    if (existingUser) {
        return res.status(400).json({ message: 'Username or Email already in use' });
    }

    // Create a new user object
    const newUser = {
        id: users.length + 1, // Simple way to auto-increment IDs
        username,
        email,
        password // Note: Store hashed passwords in a production application
    };

    // Add the new user to the users array
    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser; // Destructure to remove password

    // Return the newly created user
    return res.status(201).json(userWithoutPassword);
});

module.exports = router;
