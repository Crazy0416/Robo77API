"use strict";

const List = require("./List");

class RoomList extends List{
    constructor() {
        super();
    }

    getElem(index) {
        return this.dataStore[index];
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
        let removePos = this.findRoomId(elementId);

        if(removePos > -1){
            this.dataStore.splice(removePos, 1);
            this.listSize--;
            return true;
        }
        return false;
    };
}

module.exports = RoomList;