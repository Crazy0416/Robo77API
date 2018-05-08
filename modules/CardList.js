"use strict";

const List = require("./List");

class CardList extends List{
    constructor() {
        super();
    }

    getElem(index) {
        return this.dataStore[index];
    }

    findByCardId(elementId){
        for(let i=0; i<this.listSize; i++){
            if(this.dataStore[i].cardId === elementId){
                return i;
            }
        }
        return -1;
    };

    removeByCardId (elementId){
        let removePos = this.findByCardId(elementId);

        if(removePos > -1){
            this.dataStore.splice(removePos, 1);
            this.listSize--;
            return true;
        }
        return false;
    };
}

module.exports = CardList;