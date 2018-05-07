const redis = require('../modules/redisHandler');
const GameRoom = require('../models/GameRoom');
const User = require('../models/User');



exports = module.exports = function(io, Game) {
    io.on('connection', (socket) => {
        console.log("SOCKET CONNECTION EVENT: ", socket.id ," connected");

        socket.on('joinRoom', function(msg) {
            console.log("SOCKET joinRoom EVENT: ", 'joinRoom id: ', msg.roomId);

            if(Game.rooms.findByRoomId(msg.roomId) !== -1) {     // 방 존재한다면 JOIN
                socket.join(msg.roomId, () => {
                    // User class create
                    let user = new User(socket.id, []);
                    let roomIndex = Game.rooms.findByRoomId(msg.roomId);
                    console.log("SOCKET joinRoom EVENT: ", "찾은 룸 id: ", roomIndex);
                    Game.rooms.getElem(roomIndex).userPush(user);
                    console.log("SOCKET joinRoom EVENT: ", "GameRoom 상태: ", Game.rooms);
                    console.log("SOCKET joinRoom EVENT: ", "GameRoom User 리스트: ", Game.rooms.getElem(roomIndex).userList);
                    console.log("SOCKET joinRoom EVENT: ", socket.id, ' client\'s JOIN room ', Object.keys(socket.rooms)[0]);
                });

            } else {                                            // 방 존재하지 않으면
                // TODO: 오류처리

            }
        });

        socket.on('createRoom', function(msg) {
            console.log("SOCKET createRoom EVENT: ", 'joinRoom name', msg.roomId);

            // redis에 룸 정보와 딜러 정보 추가
            redis.set('room'+msg.roomId, socket.id, function(err) {
               if(err) console.log(err);
               console.log("SOCKET createRoom Event: \n" +
                   "\tREDIS SET: ", socket.id, " set dealer at redis");
            });

            if(Game.rooms.findByRoomId(msg.roomId) !== -1) {     // 방 존재한다면
                // TODO : 오류 처리

            } else {                                            // 방 없으면 생성
                socket.join(msg.roomId, () => {
                    // User, GameRoom class create
                    let user = new User(socket.id, []);
                    let gameRoom = new GameRoom(msg.roomId);
                    gameRoom.userPush(user);

                    Game.rooms.append(gameRoom);
                    console.log("SOCKET createRoom EVENT: ", "GameRoom 상태: ", Game.rooms);
                    console.log("SOCKET createRoom EVENT: ", "GameRoom User 리스트: ", gameRoom.userList);
                    console.log("SOCKET createRoom EVENT: ", socket.id, ' client\'s JOIN room ', Object.keys(socket.rooms)[0]);
                });
            }
        });

        socket.on('emitCard', function(msg) {

        });

        socket.on('disconnect', () => {
            // Rooms are left automatically upon disconnection
            console.log('disconnected');
        });
    });
};