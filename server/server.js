const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: { origin: '*' }
});
const setupSocketHandling = require('./middleware/socketHandler');
const setupPeerServer = require('./middleware/peerServer');

// Import seed function
const seedDatabase = require('./data/seed');

// API Routes
const authRoutes = require('./api/auth');
const groupRoutes = require('./api/group');
const channelRoutes = require('./api/channel');
const userRoutes = require('./api/user');
const messageRoutes = require('./api/message')(io);

const port = 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// API Endpoints
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/message', messageRoutes);

// PeerJS server
const peerServer = setupPeerServer(httpServer);
app.use('/peerjs', peerServer);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
        await seedDatabase(); // Call seed function after connecting to MongoDB
    })
    .catch(err => console.error('Could not connect to MongoDB...', err));

setupSocketHandling(io);

// Start the server
httpServer.listen(port, () => console.log(`Server running on port ${port}`));
