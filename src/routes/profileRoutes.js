var express = require('express');
var profileRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var url = "mongodb://zolwik:yolo123@ds113915.mlab.com:13915/gallery";

profileRouter.get('/logout', function (req, res) {
    req.session.destroy();
    req.logout();
    console.log('Logout success');
    return res.redirect('/');
});

profileRouter.use(function (req, res, next){
    if (!req.user || req.user.isAdmin) {
        return res.redirect('/');
    }
    next();
});

profileRouter.get('/', function (req, res) {
    res.render('profile', {
        user: req.user
    });
});

profileRouter.get('/settings', function (req, res) {
    res.render('settings', {
        title: 'Zmiana hasła'
    });
});

profileRouter.post('/settings/change', function (req, res) {
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('users');
        collection.findOneAndUpdate({
            username: req.user.username
        }, { $set: {password: req.body.password} }, {returnOriginal: false}, function(err, results) {
            req.login(results.value, function () {
                res.redirect('/auth/profile');
            });
        });
    });
});

module.exports = profileRouter;