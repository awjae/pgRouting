var server = require('./server');
var database = require('./database');
var util = require('./util');
var apiCall = require('./API_Call');


//기본 메인 페이지
server.get('/', function(req, res) {
    console.log('/routing.do 요청됨');

    req.app.render('routing', '', function(err, html) {
        if (err) {
            console.log('view 처리 시 에러 발생 ->' + err);
            return;
        }
        
        res.end(html);
    });

});

server.get('/setClosePoint.do', function(req, res) {
    var data = req.query;

    var sql = `WITH  nearnodes
            AS (SELECT *
            FROM (SELECT ST_Intersects(ST_Transform(geom, 4326), ST_Buffer(ST_SetSRID(ST_MakePoint($1, $2),4326), 0.005, 'quad_segs=8')) nodes, gid, ST_Transform(geom, 4326) geom
            FROM public.moct_node) a
            WHERE a.nodes = true
            ),		
            bufferPoint
            AS (SELECT ST_SetSRID(ST_MakePoint($1, $2),4326) point
            )	
            SELECT ST_Distance(
            nearnodes.geom ,
            bufferPoint.point
            ) distance, nearnodes.gid gid
            FROM nearnodes, bufferPoint
            LEFT JOIN moct_node
            ON gid = moct_node.gid
            ORDER BY distance ASC
            LIMIT 1`
    var dbParams = [data.lng, data.lat]
    database.PgQuery(res, sql, dbParams, function(err, rows) {

        if (rows.length > 0) {
            util.sendResponse(res, rows);
        } else {
            util.sendResponse(res, []);
        } 
       
    });
});

//pgrouting 요청할껀데..
server.get('/startRouting.do', function(req, res) {
    var data = req.query;
    var dbParams = [data.startGid, data.endGid]
    console.log(dbParams);
    var sql= `WITH linkRows AS (SELECT result.seq, result.id1 node_gid, result.id2 link_gid, result.cost, moctLink.geom, SUM(result.cost) OVER() distence
                FROM (
                    SELECT *
                    FROM pgr_astar(
                        'SELECT id, linkId, source, target, cost, x1, y1, x2, y2, 
                        reverse_cost FROM link_test1_table ORDER BY id',
                        $1, $2, true, true
                        ) 
                    ) result
                LEFT JOIN link_test1_table link
                ON result.id2= link.id
                LEFT JOIN moct_link moctLink
                ON moctLink.link_id = link.linkid
                WHERE result.cost != 0
                ORDER BY seq
            )
            SELECT seq, distence, ST_AsGeoJSON(ST_Transform(geom,4326)) from linkRows`
    database.PgQuery(res, sql, dbParams, function(err, rows) {

        if (rows.length > 0) {
            util.sendResponse(res, rows);
        } else {
            util.sendResponse(res, []);
        } 
        
    });

});


server.post('/postList.do', function (req, res) {
    console.log('/postList.do 요청됨');
    console.log('PARAMS');
    console.dir(req.body);

    var paramId = req.body.id;
    var paramPw = req.body.pw;

    var sql = "select id, pw from test.users where id = ? and pw = ?";

    var dbParams = [paramId, paramPw];
    
    database.query(res, sql, dbParams, function(err, rows) {
        
        req.session.user= {
            id: rows[0].id,
            name: rows[0].name
        };
        
        if (rows.length > 0) {
            util.sendResponse(res, rows);
        } else {
            util.sendResponse(res, []);
        } 
        
    });

});

server.start();