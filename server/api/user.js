const express = require('express');
const router = express.Router();
const { users } = require('../data/data.json'); // Import users array from data.js
const { createUser } = require('../helpers/userHelper');

/**
 * GET /api/user
 * Get all users
 */
router.get('/', (req, res) => {
    res.json(users);
}); //----> This is the endpoint for getting all users

/**
 * GET /api/user/:id
 * Get a user by ID
 */
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
}); //----> This is the endpoint for getting a user by ID

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

    return res.status(201).json(user);
}); //----> This is the endpoint for creating a new user

/**
 * PUT /api/user/:id
 * Update an existing user
 */
router.put('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');

    Object.assign(user, req.body); // Update the user object
    res.json(user);
}); //----> This is the endpoint for updating an existing user

/**
 * DELETE /api/user/:id
 * Delete a user by ID
 */
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).send('User not found');

    users.splice(userIndex, 1); // Remove the user from the array
    res.status(204).send();
}); //---> This is the endpoint for deleting a user by ID

module.exports = router;
