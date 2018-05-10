const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const colors = require('colors');

const lOGFILEPATH = "~/.forever/Robo77API.log";

router.get('/', function(req, res, next) {

    fs.open(lOGFILEPATH, 'r', function(err, fd) {
        fs.fstat(fd, function(err, stats) {
            let fileSize = stats.size;
            let chunkSize = 2000;
            let buffer=new Buffer(2000);
            let startPosition = fileSize - 2000;


            if (startPosition < 0) {
                startPosition = 0;
            }
            if (chunkSize > fileSize) {
                chunkSize = fileSize;
            }

            fs.read(fd, buffer, 0, chunkSize, startPosition, function(err, bytesRead, buffer) {
                if(err) console.log(colors.red("GET /log ERROR: ", err));
                res.write(buffer.toString('utf8', 0, chunkSize));
                res.end();
            });
        });
    });
});

module.exports = router;