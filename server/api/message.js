const Message = require('../models/Message');
const express = require('express');
const upload = require('../middleware/multer');
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

    // POST a new image message
    router.post('/upload', upload.single('file'), async (req, res) => {
        try {
            const file = req.file;
            const { id, userId } = req.query;
            
            if (!id || !userId) {
                res.status(400).json({ message: 'Missing required parameters' });
                return;
            }
            const imageUrl = `/storage/messages/${id}/${file.filename}`;  // Construct the image URL
            console.log('Image name ', file.filename);
            
            // Create a new message document
            const newMessage = new Message({
                message: file.originalname,
                imageUrl,
                userId,
                channelId: id,
                createdAt: new Date()
            });

            await newMessage.save();
            
            res.status(201).json({ message: newMessage.message, imageUrl: newMessage.imageUrl, createdAt: newMessage.createdAt });

        } catch (error) {
            console.error('An error occurred:', error);
            res.status(500).json({ message: 'Failed to upload file and create message.' });
        }
    });

    return router;
}