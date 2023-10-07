const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: { origin: '*' }
});
const setupSocketHandling = require('./socket/socketHandler');

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
app.use(express.json()); // Built-in middleware in Express, replaces bodyParser.json()
app.use(cors());

// API Endpoints
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/message', messageRoutes);

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
