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
                    socket.emit("emitComplete");            // 카드 낸 클라이언트에게 emitComplete 이벤트 전달.
                    console.log("SOCKET emitCard EVENT: ", "emit emitComplete to ", socket.id);
                    console.log("SOCKET emitCard EVENT: ", "emit cardInfoToDealer");
                } else {
                    console.log(colors.red("SOCKET emit EVENT: ", "card doesn't remove!!", "\n\t",
                        curUser.cardList.getList()));
                }

            }
        });

        /*
                multipelsOf11
            방금 낸 카드가 total 11의 배수가 된 경우
         */
        socket.on('multiplesOf11', function(msg) {
            console.log("SOCKET multiplesOf11 EVENT: ", "message To => ", msg.socketId);

            let roomIndex = Game.rooms.findByRoomId(msg.roomId);
            let gameRoom = Game.rooms.getElem(roomIndex);
            let gameRoomUserList = gameRoom.userList;
            let targetUser = gameRoomUserList.findBySocketId(msg.socketId);
            let targetUserSocket = io.sockets.connected[msg.socketId];

            if(targetUser.loseHeartPoint() === 0) { // 하트 포인트 없애고 게임 끝
                // 클라이언트 모두에게 gameOver emit
                gameRoomUserList.getList().forEach(function(user) {
                    let clientSocket = io.sockets.connected[user.socketId];
                    console.log("SOCKET gameOver EVENT: ", "emit user: ", clientSocket.id);
                    clientSocket.emit("gameOver");
                })
            } else {                                // 하트 포인트 없애고 게임 진행
                // 새로운 카드를 드로우
                let drawCard = gameRoom.deck.draw();
                targetUser.cardList.append(drawCard);
                console.log("SOCKET multiplesOf11 EVENT: ", "target User CardList: \n\t",
                    targetUser.cardList);

                targetUserSocket.emit("turnEndAndUpdate", {
                    "socketId": targetUserSocket.id,
                    "heart": -1,
                    "cardType": drawCard.cardType,
                    "cardNum": drawCard.cardNum,
                    "cardId": drawCard.cardId,
                });
                console.log("SOCKET multiplesOf11 EVENT: ", "turnEndAndUpdate emit to =>", targetUserSocket.id);

                let nextUserSocketId = gameRoom.nextTurnUser().socketId;
                console.log("SOCKET turnStart EVENT: ", "nextSocketid: ", nextUserSocketId);
                io.sockets.connected[nextUserSocketId].emit("turnStart");
                console.log("SOCKET turnStart EVENT: ", "emit");
            }
        });

        /*
                noCondition
            방금 낸 카드가 아무런 상황 없이 지나는 경우
         */
        socket.on('noCondition', function(msg) {
            console.log("SOCKET noCondition EVENT: ", "message To => ", msg.socketId);

            let roomIndex = Game.rooms.findByRoomId(msg.roomId);
            let gameRoom = Game.rooms.getElem(roomIndex);
            let gameRoomUserList = gameRoom.userList;
            let targetUser = gameRoomUserList.findBySocketId(msg.socketId);
            let targetUserSocket = io.sockets.connected[msg.socketId];

            // 새로운 카드를 드로우
            let drawCard = gameRoom.deck.draw();
            targetUser.cardList.append(drawCard);
            console.log("SOCKET noCondition EVENT: ", "target User CardList: \n\t",
                targetUser.cardList);

            targetUserSocket.emit("turnEndAndUpdate", {
                "socketId": targetUserSocket.id,
                "heart": 0,
                "cardType": drawCard.cardType,
                "cardNum": drawCard.cardNum,
                "cardId": drawCard.cardId,
            });
            console.log("SOCKET noCondition EVENT: ", "turnEndAndUpdate emit to =>", targetUserSocket.id);

            let nextUserSocketId = gameRoom.nextTurnUser().socketId;
            console.log("SOCKET turnStart EVENT: ", "nextSocketid: ", nextUserSocketId);
            io.sockets.connected[nextUserSocketId].emit("turnStart");
            console.log("SOCKET turnStart EVENT: ", "emit");
        });

        /*
                gameOver77
            방금 낸 카드가 total 77이상이 되어서 세트를 끝내는 경우
         */
        socket.on('gameOver77', function(msg) {
            console.log("SOCKET gameOver77 EVENT: ", "message To => ", msg.socketId);

            let roomIndex = Game.rooms.findByRoomId(msg.roomId);
            let gameRoom = Game.rooms.getElem(roomIndex);
            let gameRoomUserList = gameRoom.userList;
            let targetUser = gameRoomUserList.findBySocketId(msg.socketId);
            let targetUserSocket = io.sockets.connected[msg.socketId];

            if(targetUser.loseHeartPoint() === 0) { // 하트 포인트 없애고 게임 끝
                // 클라이언트 모두에게 gameOver emit
                gameRoomUserList.getList().forEach(function(user) {
                    let clientSocket = io.sockets.connected[user.socketId];
                    console.log("SOCKET gameOver EVENT: ", "emit user: ", clientSocket.id);
                    clientSocket.emit("gameOver");
                })
            } else {                                // 하트 포인트 없애고 게임 진행
                // 새로운 카드를 드로우
                let drawCard = gameRoom.deck.draw();
                targetUser.cardList.append(drawCard);
                console.log("SOCKET gameOver77 EVENT: ", "target User CardList: \n\t",
                    targetUser.cardList);

                targetUserSocket.emit("turnEndAndUpdate", {
                    "socketId": targetUserSocket.id,
                    "heart": -1,
                    "cardType": drawCard.cardType,
                    "cardNum": drawCard.cardNum,
                    "cardId": drawCard.cardId,
                });
                console.log("SOCKET multiplesOf11 EVENT: ", "turnEndAndUpdate emit to =>", targetUserSocket.id);

                gameRoom.deck.reshuffleUsedCards();         // usedCards를 unUsedCards로 옮기고 셔플. 세트 재시작

                // setOver emit
                gameRoomUserList.getList().forEach(function(user) {
                    let clientSocket = io.sockets.connected[user.socketId];
                    console.log("SOCKET setOver EVENT: ", "emit user: ", clientSocket.id);
                    clientSocket.emit("setOver");
                });

                let nextUserSocketId = gameRoom.nextTurnUser().socketId;
                console.log("SOCKET turnStart EVENT: ", "nextSocketid: ", nextUserSocketId);
                io.sockets.connected[nextUserSocketId].emit("turnStart");
                console.log("SOCKET turnStart EVENT: ", "emit");
            }
        })
    });
};