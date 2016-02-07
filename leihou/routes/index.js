var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/hongbao', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();

    console.log(ua);

    res.render('index', { title: 'Express' });
});

router.post('/hongbao', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    

});

router.post('/hongbao/report', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    console.log(ua);
    console.log(req.body);    
    res.json({data: 'received'});
});


module.exports = router;
