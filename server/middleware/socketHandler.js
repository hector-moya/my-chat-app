const peersByChannel = {};
module.exports = function(io) {
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
    });
};