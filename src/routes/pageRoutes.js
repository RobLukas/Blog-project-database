var express = require('express');
var pageRouter = express.Router();
var operationsSql = require('./src/scripts/operationsSql');

pageRouter.get('/:id', (req, res) => {
    operationsSql.getPostByIdFromDatabase((post) => {
        res.render('page', {post: post.recordset});
    }
})

module.exports = pageRouter;