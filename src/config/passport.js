var passport = require('passport');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
    // zapisujemy obiekt user w sesji
    passport.serializeUser(function(user, done){
        done(null, user);
    });
    // odczytujemy obiekt user z sesji
    passport.deserializeUser(function(user, done){
        done(null, user);
    });

    require('./strategies/local.strategy')();
};