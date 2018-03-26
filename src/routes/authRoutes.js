var express = require('express');
var authRouter = express.Router();
var passport = require('passport');

authRouter.post('/signUp', function (req, res) {

});

authRouter.post('/signIn', passport.authenticate('local', {
    failureRedirect: '/',
    failureMessage: "Invalid username or password"
}), function (req, res) {
    res.redirect('/auth/profile');
});

module.exports = authRouter;