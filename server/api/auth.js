const { users } = require('../data/data.json'); // Import users array from data.js
const { createUser } = require('../helpers/userHelper');
const express = require('express');
const router = express.Router();

/**
 * POST /api/auth
 * Authenticate user and respond with user object
 * @param {string} email
 * @param {string} password
 * @returns {object} user
 * @returns {boolean} valid
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Search for the user in the dummy data
    const user = users.find(u => u.email === email && u.password === password);

    console.log(user);
    if (user) {
        const { password, ...userWithoutPassword } = user; // Destructure to remove password
        res.json({ valid: true, user: userWithoutPassword });
    } else {
        res.json({ valid: false });
    }
});

/**
 * POST /api/auth/register
 * Register a new user
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {boolean} isSuper
 * @returns {object} user
 */
router.post('/register', (req, res) => {
    console.log("Incoming request data:", req.body);
    const { username, email, password } = req.body;
    console.log('Hi from auth/register');
    const { user, error } = createUser(username, email, password);

    if (error) {
        return res.status(400).json({ message: error });
    }

    return res.status(201).json( {valid: true, user});
});

module.exports = router;
