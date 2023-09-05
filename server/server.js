const express = require('express');
const app = express();
const authRoutes = require('./api/auth');
const groupRoutes = require('./api/group');
const httpServer = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(httpServer, {
    cors: { origin: '*' }
});

const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);

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
httpServer.listen(port, () => console.log(`Server running on port ${port}`));
