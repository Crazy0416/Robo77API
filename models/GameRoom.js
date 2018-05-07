const Deck = require("./Deck");
const CARDNUM_TO_USER = 5;

class GameRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.userList = [];
        this.deck = new Deck();
        this.deck.shuffle();
        this.deck.shuffle();
        this.deck.shuffle();
        // TODO : 현재 턴을 진행중인 유저와 다음 턴을 해야할 유저들을 나타낼 수 있는 자료구조 만들어야함.
        
    }

    userPush(user) {
        this.userList.push(user);
    }

    hitAllUserExceptDealer(dealerId) {
        for(let user of this.userList) {
            if(user.socketId === dealerId)      // 딜러는 카드를 지급하지 않음
                continue;
            
            for(let i = 0; i < CARDNUM_TO_USER; i++) {
                user.cardList.push(this.deck.unUsedCards.pop());
            }
        }
    }


}

module.exports = GameRoom;