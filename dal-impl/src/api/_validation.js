/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var BigNumber = require('bignumber.js');

var positiveBigIntRegexp = new RegExp("^[0-9]{1,19}$");
var positiveBigIntMin = new BigNumber('0');
var positiveBigIntMax = new BigNumber('9223372036854775807');
var regexpGuid4 = new RegExp("^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$");


module.exports = {

    positiveBigInt: function(value) {
        try {
            if (typeof value === 'string' && value.match(positiveBigIntRegexp)) {
                var val = new BigNumber(value);
                return val.greaterThanOrEqualTo(positiveBigIntMin) && val.lessThanOrEqualTo(positiveBigIntMax);
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    },

    positiveInt: function(value) {
        return typeof value === 'number' && value >= 0 && value <= 2147483647;
    },

    positiveSmallInt: function(value) {
        return typeof value === 'number' && value >= 0 && value <= 65535;
    },

    varchar: function (value, min, max) {
        return typeof value === 'string' && value.length >= min && value.length <= max;
    },

    date: function (value) {
        return (value instanceof Date);
    },

    bool: function (value) {
        return typeof value === 'boolean';
    },

    guid4: function(value) {
        return (typeof value === 'string') && value.match(regexpGuid4);
    },

    int: function (value, min, max) {
        return typeof value === 'number' && value >= min && value <= max;
    }

};