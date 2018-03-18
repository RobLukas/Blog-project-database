var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');
var nodemailer = require('nodemailer');

var url = "mongodb://zolwik:yolo123@ds113915.mlab.com:13915/gallery";

authRouter.post('/signUp', function (req, res) {
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('users');
        var photos = [];
        var user = {
            username: req.body.userName,
            password: req.body.password,
            photos: photos
        };
        var mailOptions = {
            from: 'projektttsi2018@gmail.com',
            to: req.body.userName,
            subject: 'Rejestracja',
            text: 'Właśnie zarejestrowałeś sie do Naszej strony\nTwoje hasło: ' + req.body.password
        };
        console.log(req.body.userName);
        collection.find({ username: req.body.userName }).count(function(err, result){
            if (result == 0){
                collection.insert(user, function (err) {
                    if (err){
                        res.redirect('/');
                    }
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                    });
                    req.login(user, function () {
                        res.redirect('/auth/profile');
                    });
                });
            }
            else {
                res.redirect('/');
            }
        });
    });
});

authRouter.post('/signIn', passport.authenticate('local', {
    failureRedirect: '/',
    failureMessage: "Invalid username or password"
}), function (req, res) {
    if (req.user.isAdmin) {
        res.redirect('/admin/panel');
    }
    else
        res.redirect('/auth/profile');
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'projektttsi2018@gmail.com',
      pass: 'test123123'
    }
});

module.exports = authRouter;