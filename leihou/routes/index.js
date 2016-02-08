var express = require('express');
var events = require( 'events' );
// module of mongodb
var mgDB = require( '../database/mgDB' );
var randStr = require("generate-key");

var router = express.Router();
/**init a object of mongodb**/
var mgdb = new mgDB( 1 );

/**register event on 'ready' evnets of data**/
var dataEvents = new events.EventEmitter();
dataEvents.on( 'ready', getData );

/**process the data got from database query results**/
function getData( d ){

	switch( d.database ){
		case 'mongodb':
			if( 'insert_test' == d.action ){
				console.log( d.data );
			}
			else if( 'find_test' == d.action ) {
				console.log( d.data );
			}
			else if( 'update_test' == d.action ) {
				console.log( d.data );
			}
			break;

		default:
			break;
	}

}


/* GET home page. */
router.get('/hongbao', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();

    console.log(ua);

    res.render('index', { title: 'Express' });
});

router.post('/hongbao/set', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    console.log(req.body.data);
    
    var reqData = req.body.data;
    var windowHash = randStr.generateKey(8);
    var windowLocation = randStr.generateKey(8);
    var recData = {};
    
    reqData['val_answear_1'] = randStr.generateKey(4);
    reqData['val_answear_2'] = randStr.generateKey(4);
     
    recData['windowHash'] = windowHash;
    recData['answearHash'] = reqData['answear_a_ok'] == true ? reqData['val_answear_1'] : reqData['val_answear_2'];
    recData['description_name'] = reqData['description_name'];

    // write file syn
    var fs = require('fs')
    fs.readFileSync('../public/tpl.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
       
        var result = data;
        for (var idx in reqData) {:
            var pt = new RegExp( '{{' + idx + '}}', "g" ); 
            result = result.replace( pt, reqData[idx] );
        }
        

        fs.writeFileSync('../public/bao/' + windowLocation + '.html', result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });  
     
    res.json({
        location: windowLocation,
        hash: windowHash
    });

    mgdb.insert( dataEvents, 'insert_test', 'hongbao', );    

});

router.post('/hongbao/report', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    console.log(ua);
    var now = Date();
    //console.log(req.body.data); 
    mgdb.insert( dataEvents, 'insert_test', 'report',  {time: now, text:req.body.data, userAgent:ua});   
    res.json({data: 'received'});
});

router.post('/hongbao/check', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    console.log(ua);
    var findObj = {
        windowHash: req.body.data.clientHash
    };
    mgdb.find( dataEvents, 'find_test', 'hongbao', findObj, {}, {}, res );
});


module.exports = router;
