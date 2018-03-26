var express = require('express');
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
            if (result.recordset.length == 0) {
                request.query('INSERT INTO Users VALUES(@username, @password, @date)').then(() => {
                    request.query('SELECT * FROM Users WHERE Users.UserName = @username').then((user) => {
                        req.login(user.recordset[0], function() {
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
    badRequestMessage: "Invalid username or password",
    failureFlash: true
}), function (req, res) {
    console.log('login correct');
    console.log(req.user);
    res.redirect('/');
});

module.exports = authRouter;