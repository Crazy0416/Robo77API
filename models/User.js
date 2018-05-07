class User {
    constructor(socketId) {
        this.socketId = socketId;
        this.cardList = [];
    }
}

module.exports = User;