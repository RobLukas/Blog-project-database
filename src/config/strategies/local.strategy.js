var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var configDatabase = require('../config/database-config-azure').config;
var sql = require('mssql');

module.exports = function () {
passport.use(new LocalStrategy(
    function(username, password, done) {
    var conn = new sql.ConnectionPool(configDatabase);
    conn.connect().then(() => {
      var request = new sql.Request(conn)
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Users.UserName = @username', function(err, user) {
          if (err) { return done(err); }
          if (!user.recordset.length) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!(user.recordset.passport == passport)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user.recordset);
        });
      })
  })
)}