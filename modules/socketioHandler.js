exports = module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log(socket.address, socket.ip, " connected");

        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });
    });

    io.on('disconnect', () => {
        console.log('disconnected');
    });
};