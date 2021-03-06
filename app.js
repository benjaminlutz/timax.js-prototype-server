var express = require('express'),
    app = express(),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    jwt = require('express-jwt'),
    mongo = require('mongodb'),
    monk = require('monk'),
    conf = require('./config.json');
    db = monk(conf.mongo),
    mubsub = require('mubsub');

// mubsub
var mubsubclient = mubsub('mongodb://localhost:27017/mubsub');
var channel = mubsubclient.channel('bookings');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Make our db and pub/sub channel accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    req.pubsub = channel;
    next();
});

// configure CORS header
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*, X-Requested-With, X-Prototype-Version, X-CSRF-Token, Content-Type, Authorization");
    next();
});

// configure jwt
app.use(jwt({
    secret: conf.secret,
    userProperty: 'auth'
}).unless({
    path: ['/token', '/']
}));

// jwt error behaviour
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});

// token provider route
var token = require('./routes/token');
app.use('/token', token);

// booking route
var booking = require('./routes/booking');
app.use('/booking', booking);

// serve static content
app.use(express.static(__dirname + '/static'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function() {
    console.log(('timax.js server listening on port ' + app.get('port')));
});

module.exports = app;