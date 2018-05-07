const gameRoom = require('./GameRoom');
const RoomList = require('../modules/RoomList');

class Application {
// property
    constructor() {
        this.rooms = new RoomList();
    }

// methods
    static createRoom(gameRoom) {
        Application.rooms.append(gameRoom);
    }
    static deleteRoomById(gameRoomId) {
        return Application.rooms.removeById(gameRoomId);
    }
}

module.exports = Application;