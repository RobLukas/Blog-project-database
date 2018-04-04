var express = require('express');
var formRouter = express.Router();
var configDatabase = require('../config/database-config-azure').config;
var sql = require('mssql');
var date = require('../scripts/getDate').date;

formRouter.get('/', (req, res) => {
    if (req.user)
        res.render('form', { user: req.user });
    else
        res.redirect('/login');
})

formRouter.post('/submit', (req, res) => {
    var conn = new sql.ConnectionPool(configDatabase);
    
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        .input('title', sql.NVarChar, req.body.title)
        .input('date', sql.Date, date)
        .input('text', sql.NVarChar, req.body.text)
        .input('image', sql.NVarChar, req.body.image)
        .input('userID', sql.Int, req.user.UserID)
        .query('INSERT INTO Posts VALUES (@title, CURRENT_TIMESTAMP, @text, @userID, @image)').then(() => {
            res.redirect('/');
            console.log(date);
            conn.close();
        }).catch((err) => {
            conn.close();
            res.redirect('/form');
        })
    }).catch((err) => {
        conn.close();
        res.redirect('/form');
    })
})

module.exports = formRouter;