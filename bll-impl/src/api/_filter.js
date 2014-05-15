/**
 * Created by UAS on 16.05.2014.
 */

"use strict";

var sanitizer = require('sanitizer');
var validator = require('validator');


module.exports = {
    message: function(value) {
//        return sanitizer.escape(validator.escape(validator.stripLow(value, true)));
        return sanitizer.escape(validator.stripLow(value, true));
    }
};