/**
 * Created by UAS on 05.05.2014.
 */

"use strict";

var BigNumber = require('bignumber.js');


var regexpGuid = new RegExp("^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$");
var regexpEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var appIdMin = new BigNumber('0');
var appIdMax = new BigNumber('9223372036854775807');

module.exports = {

    appId: function(value) {
        try {
            var val = new BigNumber(value);
            return val.greaterThanOrEqualTo(appIdMin) && val.lessThanOrEqualTo(appIdMax);
        } catch (err) {
            return false;
        }
    },

    guid: function(value) {
        return (typeof value === 'string') && value.match(regexpGuid);
    },

    accessToken: function(value) {
        return this.guid(value);
    },

    email: function(value) {
        return (typeof value === 'string') && value.length <= 100 && value.match(regexpEmail);
    },

    serviceUserPassword: function(value) {
        return (typeof value === 'string') && value.length >= 1 && value.length <= 64;
    },

    appUserLogin: function(value) {
        return (typeof value === 'string') && value.length >= 1 && value.length <= 64;
    },

    appUserPassword: function(value) {
        return (typeof value === 'string') && value.length >= 1 && value.length <= 64;
    },

    offset: function(value, minValue) {
        return typeof value === 'number' && !isNaN(value) && value%1 === 0 && value >= minValue;
    },

    limit: function(value, minValue, maxValue) {
        return typeof value === 'number' && !isNaN(value) && value%1 === 0 && value >= minValue && value <= maxValue;
    }

};