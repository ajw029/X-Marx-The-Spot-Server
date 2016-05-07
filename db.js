var mysql  = require('mysql');
var config = require('./config');

var MySQL = function() {
    var connection;

    return {
        init: function(){
            MySQL.connection = mysql.createConnection({
                host     : config.DATABASE_HOST,
                user     : config.DATABASE_USER,
                password : config.DATABASE_PASSWORD,
                database : config.DATABASE_NAME
            });

            MySQL.connection.connect();
        },
        query: function(querystring, callback){
            MySQL.connection.query(querystring, callback);
        },
        escape: mysql.escape
    }
}();

module.exports = MySQL;
