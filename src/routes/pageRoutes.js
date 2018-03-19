var express = require('express');
var pageRouter = express.Router();
var operationsSql = require('../scripts/operationsSql');

pageRouter.get('/:id', (req, res) => {
    operationsSql.getPostByIdFromDatabase((post) => {
        res.render('post', {post: post.recordset});
    })
    console.log(req.params.id);
})

module.exports = pageRouter;