"use strict";

const List = require("./List");

class RoomList extends List{
    constructor() {
        super();
    }

    findByRoomId(elementId){
        for(let i=0; i<this.listSize; i++){
            if(this.dataStore[i].roomId === elementId){
                return i;
            }
        }
        return -1;
    };

    removeByRoomId (elementId){
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