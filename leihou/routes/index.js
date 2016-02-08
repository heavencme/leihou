var express = require('express');
var events = require( 'events' );
// module of mongodb
var mgDB = require( '../database/mgDB' );
var randStr = require("generate-key");
var fs = require('fs');

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
                if (d.data.length < 1) {
                    d.responseObj.json({ result: 'failed'}); 
                    return;   
                } 

                //console.log(d.responseObj);
                if ( d.data[0].answearHash ) {
                    d.responseObj.json({
                        result: 'ok',
                        key: d.data[0].answearHash,
                        box: d.data[0].hongbao_code,
                        description_right: d.data[0].description_right,
                        description_wrong: d.data[0].description_wrong
                    });
                }
                else {
                    d.responseObj.json({result: 'failed'});
                }
                 //console.log(d.responseObj);
                //console.log(d.responseObj);
                                 

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
    if ( ua.search(/micromessenger/) < 0 ) {
        res.json({
            location: '',
            hash: ''
        });
    }

    console.log(req.body);
    
    var reqData = req.body;
    var windowHash = randStr.generateKey(8);
    var windowLocation = randStr.generateKey(8);
    var recData = {};
    
    reqData['val_answear_1'] = randStr.generateKey(4);
    reqData['val_answear_2'] = randStr.generateKey(4);
     
    recData['windowHash'] = windowHash;
    recData['answearHash'] = reqData['answear_a_ok'] == 'true' ? reqData['val_answear_1'] : reqData['val_answear_2'];
    recData['description_name'] = reqData['description_name'];
    recData['hongbao_code'] = reqData['hongbao_code'];
    recData['description_right'] = reqData['description_right'];
    recData['description_wrong'] = reqData['description_wrong'];

    // write file syn
    var templatePath = 'public/tpl.html';
    var data = fs.readFileSync(templatePath, 'utf8');
        
        console.log('read ok');
       
        for (var idx in reqData) {
            var pt = new RegExp( '{{' + idx + '}}', "g" ); 
            data = data.replace( pt, reqData[idx] );
        }
        
        var filePath = 'public/bao/' + windowLocation + '.html';
        console.log(filePath);
        fs.writeFileSync(filePath, data);
     
    res.json({
        location: windowLocation,
        hash: windowHash
    });

    mgdb.insert(dataEvents, 'insert_test', 'hongbao', recData);    

});

router.post('/hongbao/report', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    if ( ua.search(/micromessenger/) < 0 ) {
        res.json({data: 'received'});
    }

    console.log(ua);
    var now = Date();
    //console.log(req.body.data); 
    mgdb.insert( dataEvents, 'insert_test', 'report',  {time: now, text:req.body.data, userAgent:ua});   
    res.json({data: 'received'});
});

router.post('/hongbao/check', function(req, res, next) {
    var ua = req.headers['user-agent'].toLowerCase();
    if ( ua.search(/micromessenger/) < 0 ) {
        res.json({ result: 'failed'}); 
    }

    console.log(ua);
    var findObj = {
        windowHash: req.body.clientHash
    };
    mgdb.find( dataEvents, 'find_test', 'hongbao', findObj, {}, {}, res );
});


module.exports = router;
