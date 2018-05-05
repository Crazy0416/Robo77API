const mongoClient = require('mongoose');

const userSchema = new mongoClient.Schema({
    uid: String,
    ip: String,
    port:String
});

module.exports = mongoClient.model('user', userSchema);