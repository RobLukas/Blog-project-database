var express = require('express');
var postRouter = express.Router();
var operationsSql = require('../scripts/operationsSql');
var ConfigDatabase = require('../config/database-config-azure').config;
var sql = require('mssql');
var date = require('../scripts/getDate').date;

postRouter.get('/:id', (req, res) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.input('id', sql.Int, req.params.id)
        .query('SELECT Posts.PostID, Users.UserName, Posts.PostTitle, Posts.PostText, Posts.PostImage, Posts.PostDate FROM Posts INNER JOIN Users ON Posts.UserID=Users.UserID WHERE Posts.PostID=@id').then((resultPost) => {
            request.query('SELECT Users.UserName, Comments.Comment, Comments.CommentID, Comments.PostID, Users.UserID FROM Comments INNER JOIN Users ON Comments.UserID=Users.UserID WHERE Comments.PostID=@id').then((resultComments) => {
                res.render('post', {post: resultPost.recordset[0], comments: resultComments.recordset, user: req.user});
                postUserName = resultPost.recordset[0].UserName;
                console.log(postUserName);
                conn.close();
            })
            .catch((err) => {
                conn.close();
                res.redirect('/');
                console.log(err);
            })
        })
        .catch((err) => {
            conn.close();
            console.log(err);
            res.redirect('/');
        })
    })
})

postRouter.get('/:id/delete', (req, res) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.input('id', sql.Int, req.params.id)
        .query('DELETE FROM Comments WHERE PostID = @id').then(() => {
            request.query('DELETE FROM Posts WHERE PostID = @id').then((result) => {
                res.redirect('/');
                conn.close();
            })
        }).catch((err) => {
            conn.close();
            console.log(err);
            res.redirect('/post/' + req.params.id);
        })
    }).catch((err) => {
        conn.close();
        console.log(err);
        res.redirect('/post/' + req.params.id);
    })
})

postRouter.get('/:id/edit', (req, res) => {
    if (req.user)
        res.render('edit', { postID: req.params.id, user: req.user });
    else
        res.redirect('/login');
})

postRouter.post('/:id/edit/submit', (req, res) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        .input('title', sql.NVarChar, req.body.editTitle)
        .input('text', sql.NVarChar, req.body.editText)
        .input('image', sql.NVarChar, req.body.editImage)
        .input('id', sql.Int, req.params.id)
        .query('UPDATE Posts SET PostTitle = @title, PostText = @text, PostImage = @image WHERE PostID = @id').then(() => {
            res.redirect('/post/' + req.params.id);
            conn.close();
        }).catch((err) => {
            conn.close();
            console.log(err);
            res.redirect('/');
        })
    }).catch((err) => {
        conn.close();
        console.log(err);
        res.redirect('/');
    })
})

postRouter.post('/:id/comment/submit', (req, res) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        .input('commentText', sql.NVarChar, req.body.commentText)
        .input('date', sql.Date, date)
        .input('postId', sql.Int, req.params.id)
        .input('userID', sql.Int, req.user.UserID)
        .query('INSERT INTO Comments VALUES (@commentText, @date, @userID, @postId)').then(() => {
            res.redirect('/post/' + req.params.id);
            conn.close();
        })
        .catch((err) => {
            res.redirect('/post/' + req.params.id);
            conn.close();
            console.log(err);
        })
    })
    .catch((err) => {
        res.redirect('/post/' + req.params.id);
        conn.close();
        console.log(err);
    })
})

postRouter.get('/:id/comment/:commentid/delete', (req, res) => {
    var conn = new sql.ConnectionPool(ConfigDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        .input('commentText', sql.NVarChar, req.body.commentText)
        .input('date', sql.Date, date)
        .input('postId', sql.Int, req.params.id)
        .input('commentId', sql.Int, req.params.commentid)
        .query('DELETE FROM Comments WHERE CommentID=@commentId').then(() => {
            res.redirect('/post/' + req.params.id);
            conn.close();
        })
        .catch((err) => {
            res.redirect('/post/' + req.params.id);
            conn.close();
            console.log(err);
        })
    })
    .catch((err) => {
        res.redirect('/post/' + req.params.id);
        conn.close();
        console.log(err);
    })
})

module.exports = postRouter;