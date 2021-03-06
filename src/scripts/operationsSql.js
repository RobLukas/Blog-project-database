const ConfigDatabase = require('../config/database-config-azure').config;
const sql = require('mssql');

// exports.getUserFromDatabase = (callback) => {
//     var conn = new sql.ConnectionPool(ConfigDatabase);
//     conn.connect().then(() => {
//         var request = new sql.Request(conn);

//         request.query('SELECT * FROM Users').then((recordset) => {
//             callback(recordset);
//             conn.close();
//         }).catch((err) => {
//             conn.close();
//             throw err;
//         })
//     }).catch((err) => {
//         conn.close();
//         throw err;
//     })
// }

exports.getPostFromDatabase = (callback) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);

        request.query('SELECT Users.UserName, Posts.PostTitle, Posts.PostText, Posts.PostImage, Posts.PostDate, Posts.PostID FROM Posts LEFT OUTER JOIN Users ON Posts.UserID=Users.UserID ORDER BY Posts.PostID DESC').then((recordset) => {
            callback(recordset);
            conn.close();
        }).catch((err) => {
            conn.close();
            throw err;
        })
    }).catch((err) => {
        conn.close();
        throw err;
    })
}