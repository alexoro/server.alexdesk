/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

module.exports = {
    forEach: function(array, cb) {
        for (var i = 0; i < array.length; i++) {
            if (cb(array[i]) === false) {
                break;
            }
        }
    }
};
