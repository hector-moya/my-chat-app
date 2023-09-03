const express = require('express');
const router = express.Router();
const { users } = require('../data/data'); // Import users array from data.js

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

    // Find user in users array
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userWithoutPassword } = user; // Destructure to remove password
        user.valid = true;
        res.json({ valid: true, user: userWithoutPassword });
    } else {
        res.json({ valid: false });
    }
});

module.exports = router;
