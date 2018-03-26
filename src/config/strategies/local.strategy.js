var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var configDatabase = require('../database-config-azure').config;
var sql = require('mssql');

module.exports = function () {
passport.use(new LocalStrategy({
      passReqToCallback : true 
    },
    function(req, username, password, done) {
    var conn = new sql.ConnectionPool(configDatabase);
    conn.connect().then(() => {
      var request = new sql.Request(conn)
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Users.UserName = @username', function(err, user) {
          if (err) { return done(err); }
          if (!user.recordset.length) {
            return done(null, false, req.flash('loginMessage', 'Incorrect username or password.'));
          }
          if (!(user.recordset[0].UserPassword == password)) {
            return done(null, false, req.flash('loginMessage', 'Incorrect username or password.'));
          }
          return done(null, user.recordset[0]);
        });
      })
  })
)}