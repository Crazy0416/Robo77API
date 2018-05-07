class Card {
    constructor(cardType, cardNum, cardId) {
        this.cardType = cardType;
        this.cardNum = cardNum;     // if type is not Number, num is -1
        this.cardId = cardId;
    }
    get getCardType() {
        return this.cardType;
    }
    get getCardNum() {
        return this.cardNum;
    }
}

module.exports = Card;