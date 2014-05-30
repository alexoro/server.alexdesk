/**
 * Created by UAS on 16.05.2014.
 */

"use strict";


var sanitizer = require('sanitizer');
var validator = require('validator');


module.exports = {
    message: function(value) {
        return sanitizer.escape(validator.stripLow(value, true));
    },
    metaData: function(value) {
        return sanitizer.escape(validator.stripLow(value, true));
    },
    serviceUserName: function(value) {
        return sanitizer.escape(validator.stripLow(value, true));
    },
    appUserName: function(value) {
        return sanitizer.escape(validator.stripLow(value, true));
    }
};