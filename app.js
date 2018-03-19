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

var pageRouter = require('./src/routes/pageRoutes');

require('./src/scripts/operationsSql');

app.use('/post', pageRouter);

app.get('/', (req, res) => {
  operationsSql.getPostFromDatabase((posts) => {
        res.render('index', {posts: posts.recordset});
    })
})

app.listen(port, (err) => {
  err ? console.log(err) : console.log('running server on port ' + port);
})