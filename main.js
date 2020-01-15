var server = require('./server');
var database = require('./database');
var util = require('./util');

//기본 메인 페이지
server.get('/', function(req, res) {
    console.log('/index.do 요청됨.');
    console.log('PARAMS')
    console.log(req.query);
    
    req.app.render('index', '', function(err, html) {
        if (err) {
            console.log('view 처리 시 에러 발생 ->' + err);
            return;
        }
        
        res.end(html);
    });
});


server.get('/list.do', function(req, res) {
    console.log('/cunstomer list 요청됨.');
    console.log('PARAMS')
    console.log(req.query);
    

    var sql = "select id, pw from test.users";
    var dbParams = [];
    database.query(res, sql, dbParams, function(err, rows){
        var output= {
            rows:rows
        };
        console.log(output);
        
        req.app.render('list', output, function(err, html) {
        if (err) {
            console.log('view 처리 시 에러 발생 ->' + err);
            return;
        }
        
        res.end(html);
        });
        
    });
    
});

server.start();