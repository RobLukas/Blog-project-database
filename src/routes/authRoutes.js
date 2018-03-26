var express = require('express');
var authRouter = express.Router();
var passport = require('passport');
var sql = require('mssql');
var configDatabase = require('../config/database-config-azure').config;

authRouter.post('/signUp', function (req, res) {
    var conn = new sql.ConnectionPool(configDatabase);
    conn.connect().then(() => {
        var request = new sql.Request(conn);
        request.input('username', sql.NVarChar, req.body.usernameRegister)
        .input('password', sql.NVarChar, req.body.passwordRegister)
        .query('SELECT * FROM Users WHERE Users.UserName = @username').then((result) => {
            if (!result.recordset.length)
                
        }
    }
});

authRouter.post('/signIn', passport.authenticate('local', {
    failureRedirect: '/',
    failureMessage: "Invalid username or password"
}), function (req, res) {
    res.redirect('/');
});

module.exports = authRouter;