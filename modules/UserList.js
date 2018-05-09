"use strict";

const List = require("./List");

class UserList extends List{
    constructor() {
        super();
        this.dealer = "";
    }

    getElem(index) {
        return this.dataStore[index];
    }

    next() {
        if(this.pos < this.listSize-1){
            this.pos++;
        } else {
            this.pos = 0;
        }
        if(this.dealer === this.getList()[this.pos].socketId){
            this.next();
        }
    }

    findBySocketId(elementId){
        for(let i=0; i<this.listSize; i++){
            if(this.dataStore[i].socketId === elementId){
                return i;
            }
        }
        return -1;
    };

    removeBySocketId (elementId){
        let removePos = this.findBySocketId(elementId);

        if(removePos > -1){
            this.dataStore.splice(removePos, 1);
            this.listSize--;
            return true;
        }
        return false;
    };
}

module.exports = UserList;