const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res, next) {
    console.log(path.join(__dirname, "../public/socketTest.html"));
    res.sendFile(path.join(__dirname, "../public/socketTest.html"));
});

/* POST 딜러가 방 생성*/
router.post('/', function(req, res, next) {

});

/* GET 방 참가 */
router.get('/:roomId', function(req, res, next) {

});


module.exports = router;
