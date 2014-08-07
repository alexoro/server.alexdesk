/**
 * Created by UAS on 07.08.2014.
 */

"use strict";


var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

var rHello = require('./routes/hello');
var rSignUp = require('./routes/signup');


// ====== Set Express vars

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ====== Set Express usage-middleware

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({
    extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ======= Routes: Main

app.use('/', rHello);
app.use('/', rSignUp);


// ======= Routes: Missed & Errors

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// report the error
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


// start the server
app.listen(80);