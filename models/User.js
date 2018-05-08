const CardList = require('../modules/CardList');

class User {
    constructor(socketId) {
        this.socketId = socketId;
        this.cardList = new CardList();
    }
}

module.exports = User;