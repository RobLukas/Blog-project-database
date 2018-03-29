var express = require('express');
var sql = require('mssql'); 
var adminRouter = express.Router();

adminRouter.use(function (req, res, next) {
    if(!req.user.isAdmin){
        return res.redirect('/');
    }
    next();
});

adminRouter.get('/', function(req, res) {
    res.redirect('/admin');
})

module.exports = adminRouter;