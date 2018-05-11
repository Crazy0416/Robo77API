const CardList = require('../modules/CardList');
const HEART_CNT = 3;

class User {
    constructor(socketId) {
        this.socketId = socketId;
        this.cardList = new CardList();
        this.heart = HEART_CNT;
    }

    loseHeartPoint() {
        let curHeart = --this.heart;
        return curHeart;
    }
}

module.exports = User;