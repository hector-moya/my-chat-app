const { ExpressPeerServer } = require('peer');

module.exports = function(httpServer) {
    const peerServer = ExpressPeerServer(httpServer, {
        debug: true,
        path: '/myapp'
    });

    return peerServer;
};