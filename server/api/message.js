const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST a new message
router.post('/', async (req, res) => {
    try {
        const newMessage = new Message({
            ...req.body,
            createdAt: new Date()
        });
        await newMessage.save();
        io.to(req.body.channelId).emit('new_message', newMessage);  // Broadcast the new message only to the relevant channel
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Failed to post message.' });
    }
});

// GET messages for a specific channel
router.get('/byChannel/:channelId', async (req, res) => {
    try {
        const messages = await Message.find({ channelId: req.params.channelId }).populate('userId').sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Failed to get messages.' });
    }
});

module.exports = router;