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
        // TODO : 현재 턴을 진행중인 유저와 다음 턴을 해야할 유저들을 나타낼 수 있는 자료구조 만들어야함.
    }

    userPush(user) {
        this.userList.append(user);
    }

    hitAllUserExceptDealer(dealerId) {
        for(let user of this.userList.getList()) {
            if(user.socketId === dealerId)      // 딜러는 카드를 지급하지 않음
                continue;
            
            for(let i = 0; i < CARDNUM_TO_USER; i++) {
                user.cardList.append(this.deck.unUsedCards.pop());
            }
        }
    }

    nextTurnUser() {
        this.userList.next();
        return this.userList.getElem(this.userList.pos);
    }

}

module.exports = GameRoom;