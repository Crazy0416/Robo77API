const Deck = require("./Deck");
const UserList = require('../modules/UserList');
const CARDNUM_TO_USER = 5;

class GameRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.userList = new UserList();
        this.deck = new Deck();
        this.deck.shuffle();
        this.deck.shuffle();
        this.deck.shuffle();
    }

    userPush(user) {
        this.userList.append(user);
    }

    hitAllUserExceptDealer(dealerId) {
        for(let user of this.userList.getList()) {
            if(user.socketId === dealerId)      // 딜러는 카드를 지급하지 않음
                continue;
            
            for(let i = 0; i < CARDNUM_TO_USER; i++) {
                user.cardList.append(this.deck.draw());
            }
        }
    }

    nextTurnUser() {
        this.userList.next();       // 딜러를 제외한 유저를 선택
        return this.userList.getElem(this.userList.pos);
    }

}

module.exports = GameRoom;