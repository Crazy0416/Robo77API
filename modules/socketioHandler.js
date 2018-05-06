const redis = require('../modules/redisHandler');

exports = module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log(socket.id ," connected");

        socket.on('joinRoom', function(msg) {
            console.log('joinRoom name', msg);
            socket.join(msg, () => {
                console.log(socket.id, ' client\' in room ', Object.keys(socket.rooms)[0]);
            });
        });

        socket.on('createRoom', function(msg) {
            console.log('joinRoom name', msg);
            redis.set('room'+msg, socket.id, function(err) {
               if(err) console.log(err);
               console.log(socket.id, " set dealer at redis");
            });

            socket.join(msg, () => {
                console.log(socket.id, ' client\'s in room ', Object.keys(socket.rooms)[0]);
            });
        });

        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });
    });

    io.on('disconnect', () => {
        // Rooms are left automatically upon disconnection
        console.log('disconnected');
    });
};