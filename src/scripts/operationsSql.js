const ConfigDatabase = require('../config/database-config-azure').config;
const sql = require('mssql');
// const connection = require('../config/connection-db').connectDatabase();

exports.getUserFromDatabase = (callback) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);

        request.query('SELECT * FROM Users').then((recordset) => {
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

exports.getPostFromDatabase = (callback) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);

        request.query('SELECT Users.UserName, Posts.PostTitle, Posts.PostText, Posts.PostImage, Posts.PostDate, Posts.PostID FROM Posts LEFT OUTER JOIN Users ON Posts.UserID=Users.UserID').then((recordset) => {
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

exports.getPostByIdFromDatabase = (id, callback) => {
    // var query = 'SELECT * FROM Posts WHERE PostID = @postID';
    // var conn = new sql.ConnectionPool(ConfigDatabase);
    // conn.connect().then(() => {
    //     const result = conn.request()
    //     // .input('postID', sql.Int, postID)
    //     .query(query).then((recordset) => {
    //         callback(recordset);
    //         conn.close();
    //     }).catch((err) => {
    //         conn.close();
    //         throw err;
    //     })
    // }).catch((err) => {
    //     conn.close();
    //     throw err;
    // })
    sql.connect(ConfigDatabase).then(pool => {
        var request = new sql.Request(conn);
        return pool.request()
        .input('id', sql.Int, 5)
        .query('SELECT * FROM Posts WHERE PostID = @id')
    }).then(result => {
        console.log(result);
        callback(result);
        sql.close();
    }).catch(err => {
        sql.close();
        throw err;
    })
}