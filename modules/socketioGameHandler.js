const redis = require('../modules/redisHandler');
const GameRoom = require('../models/GameRoom');
const User = require('../models/User');



exports = module.exports = function(io, Game) {
    io.on('connection', (socket) => {
        console.log("SOCKET CONNECTION EVENT: ", socket.id ," connected");

        /*
            게임시작
        1. client->server : gameStart
        2. server->client : setStart -> trunStart
         */
        socket.on('gameStart', function(msg) {
            
        });



        socket.on('emitCard', function(msg) {

        });
    });
};