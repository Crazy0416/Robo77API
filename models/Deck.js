const Card = require('./Card');
//const stack = require('./stack');

class Deck {
    constructor () {
        const cardList = [];

        let i = 0;
        for(let num = 2; num < 10; num++) {     // 2~9까지 3번씩 넣음
            for(let cnt = 0; cnt < 3; cnt++) {
                let card = new Card(0, num, i++);
                cardList.push(card);
            }
        }
        for(let cnt = 0; cnt < 8; cnt++) {      // 10 카드 8장
            let card = new Card(0, 10, i++);
            cardList.push(card);
        }
        for(let cnt = 0; cnt < 4; cnt++) {      // 0 카드 4장
            let card = new Card(0, 0, i++);
            cardList.push(card);
        }
        for(let cnt = 0; cnt < 4; cnt++) {      // -10 카드 4장
            let card = new Card(0, -10, i++);
            cardList.push(card);
        }
        for(let cnt = 0; cnt < 2; cnt++) {      // -1 카드 2장
            let card = new Card(0, -1, i++);
            cardList.push(card);
        }
        for(let cnt = 0; cnt < 2; cnt++) {      // -3 카드 2장
            let card = new Card(0, -3, i++);
            cardList.push(card);
        }
        for(let cnt = 0; cnt < 4; cnt++) {      // x1 카드 4장
            let card = new Card(1, 1, i++);
            cardList.push(card);
        }
        for(let cnt = 1; cnt <= 6; cnt++) {      // 11,22,33,44,55,66 카드 1장
            let card = new Card(1, cnt*11, i++);
            cardList.push(card);
        }
        let card = new Card(0, 76, i++);
        cardList.push(card);

        this.unUsedCards = cardList;
        this.usedCards = [];
    }

    shuffle() {
        for (let i = this.unUsedCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.unUsedCards[i], this.unUsedCards[j]] = [this.unUsedCards[j], this.unUsedCards[i]];
        }
    }

    reshuffleUsedCards() {
        this.unUsedCards = this.usedCards;
        this.usedCards = [];

        this.shuffle();
        this.shuffle();
        this.shuffle();
        console.log("reshuffle deck: unUsedCards: ", this.unUsedCards, " usedCards: ", this.usedCards);
    }

    draw() {
        let drawCard = this.unUsedCards.pop();

        if(this.unUsedCards.length === 0) {
            console.log("unUsedCard length: 0, Deck reshuffle");
            this.reshuffleUsedCards();
            console.log("reshuffle deck: unUsedCards: ", this.unUsedCards, " usedCards: ", this.usedCards);
        }

        return drawCard;
    }
}

module.exports = Deck;