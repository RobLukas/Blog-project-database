var express = require('express');
var bodyParser = require('body-parser');
var operationsSql = require('./src/scripts/operationsSql');

var app = express();

var port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', './src/views');
app.set('view engine', 'ejs');

var postRouter = require('./src/routes/postRoutes');
var formRouter = require('./src/routes/formRoutes');

app.use('/post', postRouter, );
app.use('/form', formRouter);

app.get('/', (req, res) => {
    operationsSql.getPostFromDatabase((posts) => {
            res.render('index', {posts: posts.recordset});
    })
})

app.listen(port, (err) => {
  err ? console.log(err) : console.log('running server on port ' + port);
})