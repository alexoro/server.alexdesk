/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var BigNumber = require('bignumber.js');

var positiveBigIntRegexp = new RegExp("^[0-9]{1,19}$");
var positiveBigIntMin = new BigNumber('0');
var positiveBigIntMax = new BigNumber('9223372036854775807');
var regexpGuid4 = new RegExp("^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$");

/*var regexpChatId = new RegExp("^[0-9]{1,19}$");
var regexpInt = new RegExp("^\\-?[0-9]{1,19}$");
var regexpGuid = new RegExp("^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$");
var regexpEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var regexpHex = new RegExp("^[0-9a-f]{32}$");*/

/*var chatsListOffsetMin = 0;
var chatsListOffsetMax = 1000000;
var chatsListLimitMin = 1;
var chatsListLimitMax = 100;

var messagesListOffsetMin = -1000;
var messagesListOffsetMax =  1000;
var messagesListLimitMin = 1;
var messagesListLimitMax = 100;

var messageMinLength = 2;
var messageMaxLength = 2000;

var metaDataMinLength = 0;
var metaDataMaxLength = 1000;*/


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

    /*chatId: function(value) {
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

    serviceUserName: function(value) {
        return (typeof value === 'string') && value.length >= 0 && value.length <= 40;
    },

    appUserLogin: function(value) {
        return (typeof value === 'string') && value.length >= 1 && value.length <= 64;
    },

    appUserPassword: function(value) {
        return (typeof value === 'string') && value.length >= 1 && value.length <= 64;
    },

    appUserName: function(value) {
        return (typeof value === 'string') && value.length >= 0 && value.length <= 40;
    },

    chatsListOffset: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= chatsListOffsetMin && value <= chatsListOffsetMax;
    },

    chatsListLimit: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= chatsListLimitMin && value <= chatsListLimitMax;
    },

    messagesListOffset: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= messagesListOffsetMin && value <= messagesListOffsetMax;
    },

    messagesListLimit: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= messagesListLimitMin && value <= messagesListLimitMax;
    },

    message: function(value) {
        return typeof value === 'string' && value.length >= messageMinLength && value.length <= messageMaxLength;
    },

    platform: function(value) {
        return typeof value === 'number' && (value === domain.platforms.ANDROID || value === domain.platforms.WEB);
    },

    extra: function(value) {
        return typeof value === 'object';
    },

    countryCode2: function(value) {
        return typeof value === 'string' && (value.length === 0 || value.length === 2);
    },
    langCode2: function(value) {
        return typeof value === 'string' && (value.length === 0 || value.length === 2);
    },
    apiAndroid: function(value) {
        return typeof value === 'number' && !isNaN(value) &&
            value >= 1 && value <= 100;
    },
    apiAndroidTextValue: function(value) {
        return typeof value === 'string' && value.length >= 0 && value.length <= 40;
    },
    appBuild: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= 0 && value <= 1000000;
    },
    appVersion: function(value) {
        return typeof value === 'string' && value.length >= 0 && value.length <= 20;
    },
    deviceManufacturer: function(value) {
        return typeof value === 'string' && value.length >= 0 && value.length <= 20;
    },
    deviceModel: function(value) {
        return typeof value === 'string' && value.length >= 0 && value.length <= 20;
    },
    deviceWidthPx: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= 0 && value <= 32767;
    },
    deviceHeightPx: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= 0 && value <= 32767;
    },
    deviceDensity: function(value) {
        return typeof value === 'number' && !isNaN(value) && value.toString().match(regexpInt) &&
            value >= 0 && value <= 32767;
    },
    isRooted: function(value) {
        return typeof value === 'boolean';
    },
    metaData: function(value) {
        return typeof value === 'string' && value.length >= metaDataMinLength && value.length <= metaDataMaxLength;
    },

    deviceUuid: function(value) {
        return typeof value === 'string' && value.match(regexpHex);
    },
    gcmToken: function(value) {
        return typeof value === 'string' && value.length >= 0 && value.length <= 4096;
    },

    appTitle: function(value) {
        return typeof value === 'string' && value.length >= 1 && value.length <= 40;
    },

    appAndroidPackage: function(value) {
        return typeof value === 'string' && value.length >= 0 && value.length <= 50;
    }*/

};