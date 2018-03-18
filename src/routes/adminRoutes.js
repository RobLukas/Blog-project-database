var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');
var ObjectId = require('mongodb').ObjectID;

var url = "mongodb://zolwik:yolo123@ds113915.mlab.com:13915/gallery";

adminRouter.use(function (req, res, next) {
    if(!req.user || !req.user.isAdmin){
        return res.redirect('/');
    }
    next();
});

adminRouter.get('/panel', function(req, res){
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('users');
        collection.find().toArray(function(err, results) {
            res.render('panel', {
                users: results
            });
        });
    });
});

adminRouter.get('/panel/create', function (req, res) {
    res.render('createUser');
});

adminRouter.post('/panel/create/add', function (req, res) {
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('users');
        var photos = [];
        var user = {
            username: req.body.username,
            password: req.body.password,
            photos: photos
        }
        collection.find({ username: user.username }).count(function(err, result) {
            if (result == 0)
            {
                collection.insert(user, function (err) {
                    if (err){
                        res.redirect('/admin/panel');
                        console.log(err);
                    }
                });
            }
            res.redirect('/admin/panel');
        });
    });
});

adminRouter.get('/panel/delete/:_id', function (req, res) {
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('users');
        collection.remove( { "_id": ObjectId(req.params._id) }, function(err, result){
            console.log(req.params._id);
            if (!err){
                res.redirect('/admin/panel');
            }
            else {
                console.log(err);
            }
            db.close();
        });
    });
});

adminRouter.get('/panel/logout', function (req, res) {
    req.session.destroy();
    req.logout();
    console.log('Logout success');
    return res.redirect('/');
});

module.exports = adminRouter;