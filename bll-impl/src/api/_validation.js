/**
 * Created by UAS on 05.05.2014.
 */

"use strict";

var BigNumber = require('bignumber.js');

var regexpAppId = new RegExp("^[0-9]{1,19}$");
var regexpChatId = new RegExp("^[0-9]{1,19}$");
var regexpInt = new RegExp("^\\-?[0-9]{1,19}$");
var regexpGuid = new RegExp("^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$");
var regexpEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var appIdMin = new BigNumber('0');
var appIdMax = new BigNumber('9223372036854775807');
var chatIdMin = new BigNumber('0');
var chatIdMax = new BigNumber('9223372036854775807');

var messagesListOffsetMin = -100000;
var messagesListOffsetMax =  100000;

var messagesListLimitMin = 1;
var messagesListLimitMax = 50;


module.exports = {

    appId: function(value) {
        try {
            if (typeof value === 'string' && value.match(regexpAppId)) {
                var val = new BigNumber(value);
                return val.greaterThanOrEqualTo(appIdMin) && val.lessThanOrEqualTo(appIdMax);
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    },

    chatId: function(value) {
        try {
            if (typeof value === 'string' && value.match(regexpChatId)) {
                var val = new BigNumber(value);
                return val.greaterThanOrEqualTo(chatIdMin) && val.lessThanOrEqualTo(chatIdMax);
            } else {
                return false;
            }
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
    },

    messagesListOffset: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= messagesListOffsetMin && value <= messagesListOffsetMax;
    },

    messagesListLimit: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= messagesListLimitMin && value <= messagesListLimitMax;
    }

};