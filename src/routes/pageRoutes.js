var express = require('express');
var pageRouter = express.Router();
var operationsSql = require('../scripts/operationsSql');
var ConfigDatabase = require('../config/database-config-azure').config;
var sql = require('mssql');

pageRouter.get('/:id', (req, res) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.query('SELECT Posts.PostID, Users.UserName, Posts.PostTitle, Posts.PostText, Posts.PostImage, Posts.PostDate FROM Posts LEFT OUTER JOIN Users ON Posts.UserID=Users.UserID WHERE Posts.PostID=' + req.params.id).then((recordset) => {
            request.query('SELECT Users.UserName, Comments.Comment, Comments.PostID, Users.UserID FROM Comments LEFT OUTER JOIN Users ON Comments.UserID=Users.UserID WHERE Comments.PostID=' + req.params.id).then((resultComments) => {
                res.render('post', {post: recordset.recordset[0], comments: resultComments.recordset});
                conn.close();
            })
        }).catch((err) => {
            conn.close();
            res.redirect('/');
        })
    }).catch((err) => {
        conn.close();
        res.redirect('/');
    })
})



pageRouter.get('/:id/delete', (req, res) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.query('DELETE FROM Comments WHERE PostID = ' + req.params.id).then(() => {
            request.query('DELETE FROM Posts WHERE PostID = ' + req.params.id).then(() => {
                res.redirect('/');
                conn.close();
            })
        }).catch((err) => {
            conn.close();
            res.redirect('/');
        })
    }).catch((err) => {
        conn.close();
        res.redirect('/');
    })
})

module.exports = pageRouter;