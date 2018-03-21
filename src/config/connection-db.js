var config = require('./database-config-azure').config;
var sql = require('mssql');

exports.connectDatabase = () => {
    var pool = new sql.ConnectionPool(config);

    conn.connect((err) => {
        if(!err) {
            console.log('Database is connected');
        }
        else {
            console.log('Error connecting database');
            conn.end();
        }
    })
    return pool;
}