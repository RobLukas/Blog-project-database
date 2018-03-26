var express = require('express');
var bodyParser = require('body-parser');
var operationsSql = require('./src/scripts/operationsSql');
var session = require("express-session");
var cookieParser = require('cookie-parser');

var app = express();

var port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser('Blog-project-database'));
app.use(session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true
}));

require('./src/config/passport');

app.set('views', './src/views');
app.set('view engine', 'ejs');

var postRouter = require('./src/routes/postRoutes');
var formRouter = require('./src/routes/formRoutes');
var authRouter = require('./src/routes/authRoutes');

app.use('/post', postRouter);
app.use('/form', formRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    operationsSql.getPostFromDatabase((posts) => {
            res.render('index', {posts: posts.recordset});
    })
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.listen(port, (err) => {
  err ? console.log(err) : console.log('running server on port ' + port);
})