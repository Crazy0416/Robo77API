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

    getElem(index) {
        return this.dataStore[index];
    }

    getList() {
        return this.dataStore;
    }

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

    /* 탐색 위치를 맨 앞의 요소로 */
    front() {
        this.pos = 0;
    }

    /* 탐색 위치를 맨 뒤의 요소로 */
    end() {
        this.pos = this.listSize-1;
    }

    /* 현재 탐색 위치보다 이전으로 이동 */
    prev() {
        if(this.pos > 0){
            this.pos--;
        }
    }

    /* 현재 탐색 위치보다 이후로 이동 */
    next() {
        if(this.pos < this.listSize-1){
            this.pos++;
        }
    }

    /* 현재 탐색 position 리턴 */
    currPos() {
        return this.pos;
    }
};

module.exports = List;