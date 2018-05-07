const List = function(){
    this.dataStore = [];
    this.pos = 0;
    this.listSize = 0;
};

List.prototype.append = function(element){
    this.dataStore[this.listSize] = element;
    this.listSize++;
};

List.prototype.find = function(element){
    for(let i=0; i<this.listSize; i++){
        if(this.dataStore[i] === element){
            return i;
        }
    }
    return -1;
};

List.prototype.findRoomId = function(elementId){
    for(let i=0; i<this.listSize; i++){
        if(this.dataStore[i].roomId === elementId){
            return i;
        }
    }
    return -1;
};

List.prototype.remove = function(element){
    let removePos = this.find(element);

    if(removePos > -1){
        this.dataStore.splice(removePos, 1);
        this.listSize--;
        return true;
    }
    return false;
};

List.prototype.removeById = function(elementId){
    let removePos = this.findRoomId(elementId);

    if(removePos > -1){
        this.dataStore.splice(removePos, 1);
        this.listSize--;
        return true;
    }
    return false;
};

List.prototype.length = function(){
    return this.listSize;
};

List.prototype.toString = function(){
    return this.dataStore;
};

List.prototype.clear = function(){
    this.dataStore = [];
    this.listSize = 0;
    this.pos = 0;
};

module.exports = List;