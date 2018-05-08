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
            console.log("SOCKET gameStart EVENT: ", "on");
            let roomIndex = Game.rooms.findByRoomId(msg.roomId);
            let gameRoom = Game.rooms.getElem(roomIndex);

            // 방에 존재하는 모든 유저에게 카드 5장 배포 딜러 제외
            gameRoom.hitAllUserExceptDealer(socket.id);

            gameRoom.userList.getList().forEach(function(user) {
                let clientSocket = io.sockets.connected[user.socketId];
                clientSocket.emit("setStart", {
                    "socketId": socket.id,
                    "cards": user.cardList
                });
                console.log("SOCKET setStart EVENT: ", "emit user: ", clientSocket.id);
            });

            let nextUserSocketId = gameRoom.nextTurnUser().socketId;
            console.log("SOCKET turnStart EVENT: ", "nextSocketid: ", nextUserSocketId);
            io.sockets.connected[nextUserSocketId].emit("turnStart");
            console.log("SOCKET turnStart EVENT: ", "emit");
        });


        /*
            카드 전달 받는 이벤트 emitCard
        먼저 현재 턴에 내야하는게 맞는 유저인지 확인한다.
        emitCard로 받은 카드 데이터를 딜러에게 전달해야한다. cardInfoToDealer
         */
        socket.on('emitCard', function(msg) {
            if(msg.socketId !== Game.rooms) {

            }
        });
    });
};