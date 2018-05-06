const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('connect', () => {
   console.log("Connected to Redis");
});

redisClient.on('error', function(err) {
    console.log('Redis error: ' + err);
});

module.exports = redisClient;