const CardList = require('../modules/CardList');
const HEART_CNT = 5;

class User {
    constructor(socketId) {
        this.socketId = socketId;
        this.cardList = new CardList();
        this.heart = HEART_CNT;
    }
}

module.exports = User;