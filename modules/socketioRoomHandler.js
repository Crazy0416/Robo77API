const redis = require('../modules/redisHandler');
const GameRoom = require('../models/GameRoom');
const User = require('../models/User');
const colors = require('colors');



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
                    console.log("SOCKET joinRoom EVENT: ", socket.id, ' client\'s JOIN room: ', Object.keys(socket.rooms)[0]);

                    Game.rooms.getElem(roomIndex).userPush(user);
                    socket.roomId = msg.roomId;
                });

            } else {                                            // 방 존재하지 않으면
                // TODO: 오류처리
                console.log(colors.red("SOCKET joinRoom EVENT: " + socket.id + " cannot join ROOM: " + msg.roomId));
            }
        });

        socket.on('createRoom', function(msg) {
            // redis에 룸 정보와 딜러 정보 추가
            redis.set('room'+msg.roomId, socket.id, function(err) {
               if(err) console.log(err);
               console.log("SOCKET createRoom Event: \n" +
                   "\tREDIS SET: ", socket.id, " set dealer at redis");
            });

            if(Game.rooms.findByRoomId(msg.roomId) !== -1) {     // 방 존재한다면
                // TODO : 오류 처리
                console.log(colors.red("SOCKET createRoom EVENT: " + socket.id + " cannot create room: " + msg.roomId));
            } else {                                            // 방 없으면 생성
                socket.join(msg.roomId, () => {
                    // User, GameRoom class create
                    let user = new User(socket.id, []);
                    let gameRoom = new GameRoom(msg.roomId);

                    gameRoom.userPush(user);
                    gameRoom.userList.dealer = user.socketId;       // userList에 딜러 변수 추가
                    socket.roomId = msg.roomId;

                    Game.createRoom(gameRoom);
                    console.log("SOCKET createRoom EVENT: ", socket.id, ' client\'s JOIN room ', Object.keys(socket.rooms)[0]);
                });
            }
        });

        socket.on('disconnect', () => {
            // Rooms are left automatically upon disconnection
            let roomIndex = Game.rooms.findByRoomId(socket.roomId);
            let gameRoom = Game.rooms.getElem(roomIndex);
            gameRoom.userList.removeBySocketId(socket.id);

            if(gameRoom.userList.length() === 0) {
                if(Game.deleteRoomById(socket.roomId)) {        // 룸 삭제되었을 때
                    console.log("SOCKET disconnect EVENT: ", socket.roomId, " room delete!!", "\n\t" +
                        "GameRoomList: ", Game.rooms);    
                } else {                                        // 룸 삭제 실패
                    // TODO: 룸 삭제 실패 오류 처리 해야함
                    console.log(colors.red("SOCKET disconnect EVENT: ", socket.roomId, " room doesn't delete!!"))
                }
            }

            console.log("SOCKET disconnect EVENT: ", "게임 방 유저 리스트: \n" +
            "\t", gameRoom.userList.getList());

            console.log(colors.red(socket.id, ' disconnected'));
        });
    });
};