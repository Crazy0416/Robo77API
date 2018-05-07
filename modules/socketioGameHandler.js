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
            let roomId = msg.roomId;
            let roomIndex = Game.rooms.findByRoomId(msg.roomId);

            // 방에 존재하는 모든 유저에게 카드 5장 배포 딜러 제외
            Game.rooms.getElem(roomIndex).hitAllUserExceptDealer(socket.id);

            Game.rooms.getElem(roomIndex).userList.forEach(function(user) {
                let clientSocket = io.sockets.connected[user.socketId];
                clientSocket.emit("setStart", {
                    "socketId": socket.id,
                    "cards": user.cardList     // TODO: 카드 랜덤을 지급
                });
            });
        });



        socket.on('emitCard', function(msg) {

        });
    });
};