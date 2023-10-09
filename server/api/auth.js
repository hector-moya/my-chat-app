const User = require('../models/User');
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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email, password: password });

    if (user) {
      if (user.status === "pending") {
        return res
          .status(403)
          .json({ valid: false, message: "Your account is pending approval." });
      }
      const { password, ...userWithoutPassword } = user.toObject();
      res.json({ valid: true, user: userWithoutPassword });
    } else {
      res.json({ valid: false, message: "Invalid credentials." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * POST /api/auth/register
 * Register a new user
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {boolean} status
 * @returns {object} user
 */
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const user = new User({
            userName: username,
            email: email,
            password: password
        });

        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(201).json({ valid: true, user: userWithoutPassword });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
