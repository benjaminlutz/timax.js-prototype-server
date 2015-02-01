var express = require('express'),
    app = express(),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('localhost:27017/timax-js-prototype');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Make our db accessible to our router
app.use(function(req, res, next) {
    req.db = db;
    next();
});

// booking route
var booking = require('./routes/booking');
app.use('/booking', booking);

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


module.exports = app;