var database = {};

var mysql = require('mysql');
var util = require('./util'); // util.js안의 정보를 요청함

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'test',
    debug: false
});

database.query = function(res, sql, dbParams, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            console.log('DB 연결시 에러 발생: ' + err);

            if (conn) {
                conn.release();
            }
            return;
        }

        var query = conn.query(sql, dbParams, function(err2, rows) {
            if (conn) {
                conn.release();
                console.log(query.sql);
            }
            
            if (err2) {
                console.log('SQL 실행시 에러 발생: ' + err2);
                
                callback(err2, null);
                
                return;
            }
            
            if (callback) {
                callback(null, rows);  
            }            
            
        });
    });
    
};



module.exports = database;