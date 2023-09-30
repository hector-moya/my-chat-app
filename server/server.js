const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: { origin: '*' }
});


// API Routes
const authRoutes = require('./api/auth');
const groupRoutes = require('./api/group');
const channelRoutes = require('./api/channel');
const userRoutes = require('./api/user');

const port = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// API Endpoints
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/channel', channelRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Socket.io Configuration
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substr(0, 2)} said: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
httpServer.listen(port, () => console.log(`Server running on port ${port}`));
