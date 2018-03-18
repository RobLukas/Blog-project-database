var express = require('express');
var photoRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var url = "mongodb://zolwik:yolo123@ds113915.mlab.com:13915/gallery";

photoRouter.use(function (req, res, next) {
    if (!req.user || req.user.isAdmin) {
        return res.redirect('/');
    }
    next();
});

photoRouter.get('/', function (req, res) {
    res.render('photos', {
        title: 'Zdjęcia',
        photo: req.user.photos
    });
});

photoRouter.get('/add', function (req, res) {
    res.render('addPhoto');
});

photoRouter.post('/add/save', function (req, res){
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('users');
        var add = {
            _id: new ObjectId(),
            name: req.body.photoName,
            path: req.body.photoPath
        }
        collection.findOneAndUpdate({
            username: req.user.username
        }, { $push: {photos: add} }, {returnOriginal: false}, function(err, results) {
            req.login(results.value, function () {
                res.redirect('/auth/profile/photos');
            });
        });
    });
});

photoRouter.get('/delete/:_id', function (req, res){
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('users');
        collection.findOneAndUpdate({ username: req.user.username }, { $pull: { photos: { _id: ObjectId(req.params._id) } } } , {returnOriginal: false}, function(err, result) {
            if (!err) {
                req.login(result.value, function () {
                    res.redirect('/auth/profile/photos');
                });
            }
        });
    });
});

module.exports = photoRouter;

// exports.validateRegister = (req, res, next) => {
//     req.sanitizeBody('name');
//     req.checkBody('name', 'You must supply a name!').notEmpty();
//     req.checkBody('email', 'That Email is not valid!').isEmail();
//     req.sanitizeBody('email').normalizeEmail({
//       gmail_remove_dots: false,
//       remove_extension: false,
//       gmail_remove_subaddress: false
//     });
//     req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
//     req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
//     req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);
  
//     const errors = req.validationErrors();
//     if (errors) {
//       req.flash('error', errors.map(err => err.msg));
//       res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
//       return;
//     }
//     next();
//   };