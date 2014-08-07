/**
 * Created by UAS on 07.08.2014.
 */

"use strict";

var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
    res.render('index', {
        title: 'Hello World'
    });
});


module.exports = router;