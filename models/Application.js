const gameRoom = require('./GameRoom');
const RoomList = require('../modules/RoomList');

class Application {
// property
    constructor() {
        this.rooms = new RoomList();
    }

// methods
    createRoom(gameRoom) {
        this.rooms.append(gameRoom);
    }
    deleteRoomById(gameRoomId) {
        return this.rooms.removeByRoomId(gameRoomId);
    }
}

module.exports = Application;