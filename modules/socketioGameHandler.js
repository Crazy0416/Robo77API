const redis = require('../modules/redisHandler');
const GameRoom = require('../models/GameRoom');
const User = require('../models/User');
const Card = require('../models/Card');
const colors = require('colors');



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
                console.log("SOCKET setStart EVENT: ", "emit user: ", clientSocket.id);
                clientSocket.emit("setStart", {
                    "socketId": clientSocket.id,
                    "cards": user.cardList.getList()
                });
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
            console.log("SOCKET emitCard EVENT: ", msg.socketId, " emit card => " +
                "Num: ", msg.cardNum, " Type : ", msg.cardType);

            let roomIndex = Game.rooms.findByRoomId(msg.roomId);
            let gameRoom = Game.rooms.getElem(roomIndex);
            let gameRoomUserList = gameRoom.userList;
            let currTurnPos = gameRoom.userList.currPos();

            if(msg.socketId !== gameRoomUserList.getList()[currTurnPos].socketId) {
                // TODO: 자신 차례도 아닌데 냈을 때 오류처리
            } else {
                let curUser = gameRoomUserList.getList()[currTurnPos];
                let roomDealer = io.sockets.connected[gameRoomUserList.dealer];
                let emitCardId = curUser.cardList.findByCardId(msg.cardId);
                let emitCard = curUser.cardList.getList()[emitCardId];

                if(curUser.cardList.removeByCardId(msg.cardId)) {       // 유저가 가진 카드에서 제출한 카드 제거
                    gameRoom.deck.usedCards.push(emitCard);     // usedCards로 제출한 카드 이동
                    console.log("SOCKET emitCard EVENT: ", curUser.socketId, " card Remove.");
                    console.log("SOCKET emitCard EVENT: ", msg.roomId," room usedCards List: \n",
                        gameRoom.deck.usedCards);
                    roomDealer.emit("cardInfoToDealer", {
                        "socketId": socket.id,
                        "cardId": msg.cardId,
                        "cardType": msg.cardType,
                        "cardNum": msg.cardNum
                    });
                    console.log("SOCKET emitCard EVENT: ", "emit cardInfoToDealer");
                } else {
                    console.log(colors.red("SOCKET emit EVENT: ", "card doesn't remove!!", "\n\t",
                        curUser.cardList.getList()));
                }

            }
        });
    });
};