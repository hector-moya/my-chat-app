const peersByChannel = {};
module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('a user connected');

        // When a user chooses a channel, join them to a room named after the channel ID
        socket.on('join_room', (channelId, userId, userName) => {
            socket.join(channelId);
            const message = {
                message: `${userName} joined channel}`,
                channelId,
                userId,
                userName,
                createdAt: new Date(),
                type: 'system'
            };
            io.to(channelId).emit('user_joined', message);
            console.log(`${userName} joined channel ${channelId} and type is ${message.type}`);
        });

        socket.on('leave_room', (channelId, userId, userName) => {
            socket.leave(channelId);
            const message = {
                message: `${userName} left channel`,
                channelId,
                userId,
                userName,
                createdAt: new Date(),
                type: 'system'
            };
            io.to(channelId).emit('user_left', message);
            console.log(`${userName} left channel ${channelId} and type is ${message.type}`);
        });

        socket.on('message', (data) => {
            const messageWithDate = {
                ...data,
                createdAt: new Date()
            };
            io.to(data.channelId).emit('new_message', messageWithDate);
        });

        socket.on('new_image_message', (data) => {
            const messageWithDate = {
                ...data,
                createdAt: new Date()
            };
            io.to(data.channelId).emit('new_image_message', messageWithDate);
            console.log('new_image_message', messageWithDate);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            // Cleanup: remove this peer from all channels
            for (let channelId in peersByChannel) {
                peersByChannel[channelId] = peersByChannel[channelId].filter(id => id !== socket.id);
            }
        });

        // Handle joining a video room
        socket.on('join_video_room', (channelId, userId) => {
            socket.join(`video-${channelId}`);  // Prefixing with 'video-' to differentiate from chat rooms
            io.to(`video-${channelId}`).emit('new_peer', userId);  // Notify others in the room about the new peer
            console.log(`${userId} joined video room ${channelId}`);
        });

        // Handle leaving a video room
        socket.on('leave_video_room', (channelId, userId) => {
            socket.leave(`video-${channelId}`);
            io.to(`video-${channelId}`).emit('peer_left', userId);  // Notify others in the room about the peer leaving
            console.log(`${userId} left video room ${channelId}`);
        });

        // Handle request for list of peers in a video room
        socket.on('get_peers', (channelId, callback) => {
            const room = io.sockets.adapter.rooms.get(`video-${channelId}`);
            const peers = Array.from(room || []);
            socket.emit('peers', peers);  // Send the list of peers back to the requester
        });

        // Return the list of peers in a channel upon request
        socket.on('peers_in_channel', (channelId, callback) => {
            const room = io.sockets.adapter.rooms.get(`video-${channelId}`);
            const peers = Array.from(room || []);
            socket.emit('peers_in_channel', peers.filter(peerId => peerId !== socket.id));  // Exclude the requesting user from the list
        });

    });
};