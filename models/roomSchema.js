const mongoClient = require('mongoose');

const roomSchema = new mongoClient.Schema({
    roomId: String,
    Users: Array,
});

module.exports = mongoClient.model('room', roomSchema);