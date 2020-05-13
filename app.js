var express = require('express');
var bodyParser = require('body-parser');
var operationsSql = require('./src/scripts/operationsSql');
var session = require("express-session");
// var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var app = express();

var port = process.env.PORT || 5000;

// udostepnianie wszystkich plików statycznych z katalogu public
app.use(express.static('public'));
// przetwarza treści żądania HTTP gdzie Content-type jest JSON lub urlencoded req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// wiadomości flash są zapisywane w sesji
app.use(flash());

// app.use(cookieParser('Blog-project-database'));
// aby zapisać lub uzyskać dostęp do danych sesji req.session
app.use(session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true
}));

require('./src/config/passport')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

var postRouter = require('./src/routes/postRoutes');
var formRouter = require('./src/routes/formRoutes');
var authRouter = require('./src/routes/authRoutes');
var listRouter = require('./src/routes/listRoutes');

//ładujemy moduły routerów w aplikacji app
app.use('/post', postRouter);
app.use('/form', formRouter);
app.use('/auth', authRouter);
app.use('/list', listRouter);

app.get('/', (req, res) => {
    operationsSql.getPostFromDatabase((posts) => {
            res.render('index', {posts: posts.recordset, user: req.user });
    })
})

// Po odebraniu żądania HTTP nastepuje wywołanie callback wraz z obiektami req i res. Ale przed wywołaniem Node najpierw przetworzy nagłówki żądania i dostarczy je do obiektu res, nie nastąpi jednak przetwarzanie danych żądania przed wywołaniem calback'u
app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('loginMessage') });
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/logout', function (req, res) {
    req.session.destroy();
    req.logout();
    console.log('Logout success');
    return res.redirect('/');
});

app.listen(port, (err) => {
  err ? console.log(err) : console.log('running server on port ' + port);
})