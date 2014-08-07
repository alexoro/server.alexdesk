/**
 * Created by UAS on 07.08.2014.
 */

"use strict";


var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
    res.send('hello world');
});

app.listen(80);