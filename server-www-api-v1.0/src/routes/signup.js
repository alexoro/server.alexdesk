/**
 * Created by UAS on 07.08.2014.
 */

"use strict";

var express = require('express');
var router = express.Router();


router.get('/signup', function(req, res){
    res.send('signup');
});


module.exports = router;