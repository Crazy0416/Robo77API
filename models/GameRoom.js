class GameRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.userList = [];
    }

    userPush(user) {
        this.userList.push(user);
    }
}

module.exports = GameRoom;