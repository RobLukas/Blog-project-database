var express = require('express');
var formRouter = express.Router();
var configDatabase = require('../config/database-config-azure').config;
var sql = require('mssql');
var date = require('../scripts/getDate').date;

formRouter.get('/', (req, res) => {
    res.render('form');
})

formRouter.post('/submit', (req, res) => {
    var conn = new sql.ConnectionPool(configDatabase);
    
    conn.connect().then(() => {
        var request = new sql.Request(conn)
        .input('title', sql.NVarChar, req.body.title)
        .input('date', sql.Date, date)
        .input('text', sql.NVarChar, req.body.text)
        .input('image', sql.NVarChar, req.body.image)
        .query('INSERT INTO Posts VALUES (@title, @date, @text, 1, @image)').then(() => {
            res.redirect('/');
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