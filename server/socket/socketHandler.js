module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('a user connected');

        // When a user chooses a channel, join them to a room named after the channel ID
        socket.on('join_room', (channelId) => {
            console.log(`User joined channel ${channelId}`);
            socket.join(channelId);
        });

        // When a user sends a message, broadcast it only to users in the channel's room
        socket.on('message', (data) => {
            const messageWithDate = {
                ...data,
                createdAt: new Date()
            };
            io.to(data.channelId).emit('new_message', messageWithDate);
        });

        socket.on('new_image_message', (data) => {
            io.to(data.channelId).emit('new_image_message', data);
            console.log('new_image_message', data);
          });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};