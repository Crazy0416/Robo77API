const express = require('express');
const router = express.Router();
const path = require('path');
const io = require('socket.io');

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, "../public/socketTest.html"));
});

/* POST 딜러가 방 생성
*  일단 room1 만 만듦
* */
router.post('/', function(req, res, next) {
    let io = req.app.get('socketio');

    // TODO: room 1이 존재하는 지 확인 -> room이 여러개 생기면 나중에 바꿔야함
    if(io.sockets.adapter.rooms['1']) {
        console.log("1 room already exist");
        res.status(403).json({
            "success": false,
            "message": "1 room already exist"
        })
    } else {
        res.json({
            "success": true,
            "roomId" : 1,
            "message": "1 room create"
        })
    }
});

/* GET 방 참가 */
router.get('/:roomId', function(req, res, next) {
    let io = req.app.get('socketio');

    if(io.sockets.adapter.rooms['1']) {
        res.json({
            "success": true,
            "roomId" : 1
        })
    } else {
        console.log("1 room already exist");
        res.status(403).json({
            "success": false
        })
    }
});


module.exports = router;
