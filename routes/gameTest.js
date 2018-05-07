const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, "../public/socketTest.html"));
});

router.get('/dealer', function(req, res, next) {
    res.sendFile(path.join(__dirname, "../public/socketTestDealer.html"));
});

module.exports = router;