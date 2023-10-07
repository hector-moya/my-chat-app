const Message = require('../models/Message');
const express = require('express');
const router = express.Router();

module.exports = (io) => {
    // POST a new message
    router.post('/', async (req, res) => {
        try {
            const newMessage = new Message({
                ...req.body,
                createdAt: new Date()
            });
            await newMessage.save();
            // const populatedMessage = await Message.populate(newMessage, { path: 'userId' });
            // io.to(req.body.channelId).emit('new_message', populatedMessage); 
            res.status(201).json('Successfully posted');
        } catch (error) {
            console.error('An error occurred:', error);
            res.status(500).json({ message: 'Failed to post message.' });
        }
    });

    // GET messages for a specific channel
    router.get('/byChannel/:channelId', async (req, res) => {
        console.log(req.params.channelId);
        try {
            const messages = await Message.find({ channelId: req.params.channelId }).populate('userId').sort({ createdAt: 1 });
            res.status(200).json(messages);
        } catch (error) {
            console.error('An error occurred:', error);
            res.status(500).json({ message: 'Failed to get messages.' });
        }
    });

    return router;
}