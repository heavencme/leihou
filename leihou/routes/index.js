var express = require('express');
var events = require( 'events' );
// module of mongodb
var mgDB = require( '../database/mgDB' );

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
    console.log(req.body);
    //mgdb.insert( dataEvents, 'insert_test', 'hongbao', docArr );    

});

router.post('/hongbao/report', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    console.log(ua);
    //console.log(req.body); 
    mgdb.insert( dataEvents, 'insert_test', 'report',  {d:"data"});   
    res.json({data: 'received'});
});


module.exports = router;
