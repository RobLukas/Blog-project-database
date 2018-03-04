var express = require('express');

var app = express();

var port = process.env.PORT || 5000;

app.use(express.static('public'));

app.set('views', './src/views');

// var adminRouter = require('./src/routes/adminRoutes');
// var authRouter = require('./src/routes/authRoutes');
// var profileRouter = require('./src/routes/profileRoutes');
// var photoRouter = require('./src/routes/photoRoutes');

// app.use('/Auth', authRouter);
// app.use('/Admin', adminRouter);
// app.use('/Auth/Profile', profileRouter);

// app.get('/', function (req, res) {
//     res.render('log');
// });
app.listen(port, function (err) {
    if (err)
        console.log(err);
    else
        console.log('running server on port ' + port);
});

