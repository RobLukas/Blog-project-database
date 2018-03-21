var express = require('express');
var formRouter = express.Router();
var configDatabase = require('../config/database-config-azure').config;
var sql = require('mssql');
var datetime = require('../scripts/getDate').datetime;

formRouter.get('/', (req, res) => {
    res.render('form');
})

formRouter.post('/submit', (req, res) => {
    var conn = new sql.ConnectionPool(configDatabase);
    
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.query('INSERT INTO Posts VALUES (\'' + req.body.title + '\', \'' + datetime + '\', \'' + req.body.text + '\', 1,\'' + req.body.image + '\')').then(() => {
            res.redirect('/');
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