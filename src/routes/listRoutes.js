var express = require('express');
var sql = require('mssql');
var listRouter = express.Router();
// gdy node wczyta zawartość modułu, wartością zwrotną funkcji require bedzie zawartość obiektu exports zdefiniowanego w module
var config = require('../config/database-config-azure').config;
var getDate = require('../scripts/getDate').date;

// wysyłane jest żądanie HTTP  i emitowane jest zdarzenie na serwerze www, a następnie wywoływała jest odpowiedz na żądanie czyli wywołanie zwrotne(callback) i definiujemy co chcemy z np. danymi zrobić
listRouter.get('/', function(req, res) {
    var conn = new sql.ConnectionPool(config);
    if (!req.query.date) {
        conn.connect().then(() => {
            var request = new sql.Request(conn);
            var query = 'select Users.UserName, COALESCE(sum(DISTINCT DATALENGTH(Posts.PostText)), 0) as lengthTextPost, COALESCE(sum(DISTINCT DATALENGTH(Comments.Comment)), 0) as lengthTextComment, count(DISTINCT Posts.PostID) as cntPost, count(DISTINCT Comments.CommentID) as cntComment from ((Users left join Posts on Users.UserID = Posts.UserID) left join Comments on Users.UserID = Comments.UserID) group by UserName';
            var stringInf = 'all_dates';
            request.query(query).then((result) => {
                    res.render('list', { user: req.user, results: result.recordset, realDate: stringInf });
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
    }
    else {
        conn.connect().then(() => {
            var request = new sql.Request(conn);
            
            request.input('date', sql.Date, req.query.date)
            .query('select Users.UserName, COALESCE(sum(DISTINCT DATALENGTH(Posts.PostText)), 0) as lengthTextPost, COALESCE(sum(DISTINCT DATALENGTH(Comments.Comment)), 0) as lengthTextComment, count(DISTINCT Posts.PostID) as cntPost, count(DISTINCT Comments.CommentID) as cntComment from ((Users left join Posts on Users.UserID = Posts.UserID) left join Comments on Users.UserID = Comments.UserID) where Posts.PostDate = @date group by UserName').then((result) => {
                    console.log(result);
                    console.log(req.query.date);
                    res.render('list', { user: req.user, results: result.recordset, realDate: req.query.date });
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
    }
})

module.exports = listRouter;