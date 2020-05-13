var express = require('express');
// uzywamy instancji Router do utworzenia modułowego obsługiwania tras(route)
var authRouter = express.Router();
var passport = require('passport');
var sql = require('mssql');
var configDatabase = require('../config/database-config-azure').config;
var date = require('../scripts/getDate').date;

authRouter.post('/signUp', function (req, res) {
    var conn = new sql.ConnectionPool(configDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.input('username', sql.NVarChar, req.body.usernameRegister)
        .input('password', sql.NVarChar, req.body.passwordRegister)
        .input('date', sql.Date, date)
        .query('SELECT * FROM Users WHERE Users.UserName = @username').then((result) => {
            // wykonujemy zapytanie do bazy danych i następnie wywołujemy calback z argumentem z otrzymanymi danymi i je przetwarzamy.
            if (result.recordset.length == 0) {
                request.query('INSERT INTO Users VALUES(@username, @password, @date)').then(() => {
                    request.query('SELECT * FROM Users WHERE Users.UserName = @username').then((user) => {
                        req.login(user, function() {
                            res.redirect('/');
                        })
                    })
                })
                .catch((err) => {
                    res.redirect('/register');
                })
            }
            else {
                res.redirect('/register');
            }
        })
    })
});

authRouter.post('/signIn', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    if (req.user.isAdmin) {
        res.redirect('/admin');
    }
    else {
        console.log('login correct');
        console.log(req.user);
        res.redirect('/');
    }
});

module.exports = authRouter;

// i montujemy moduł routera na sciezce głownej app