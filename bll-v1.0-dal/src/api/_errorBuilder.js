/**
 * Created by UAS on 03.05.2014.
 */

"use strict";


module.exports = function(number, message) {
    var err = new Error('(' + number + ') ' + message);
    err.number = number;
    return err;
};