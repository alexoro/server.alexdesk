/**
 * Created by UAS on 07.08.2014.
 */

"use strict";


var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('hello world');
});

app.listen(80);