"use strict";

class List {
    constructor() {
        this.dataStore = [];
        this.pos = 0;
        this.listSize = 0;
    }

    append(element) {
        this.dataStore[this.listSize] = element;
        this.listSize++;
    };

    find(element) {
        for (let i = 0; i < this.listSize; i++) {
            if (this.dataStore[i] === element) {
                return i;
            }
        }
        return -1;
    };

    remove (element) {
        let removePos = this.find(element);

        if (removePos > -1) {
            this.dataStore.splice(removePos, 1);
            this.listSize--;
            return true;
        }
        return false;
    };

    length() {
        return this.listSize;
    };

    toString() {
        return this.dataStore;
    };

    clear() {
        this.dataStore = [];
        this.listSize = 0;
        this.pos = 0;
    };
};

module.exports = List;