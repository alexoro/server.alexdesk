/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var bllIntf = require('../../../bll-interface');


module.exports = {

    guid:  {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$"
    },

    appName: {
        "type": "string",
        "minlength": 1,
        "maxlength": 40
    },

    positiveSmallInt: {
        "type": "integer",
        "minimum": 0,
        "maximum": 32767
    },

    positiveInt: {
        "type": "integer",
        "minimum": 0,
        "maximum": 2147483647
    },

    platformType: {
        "enum": [bllIntf.platforms.ANDROID]
    },

    appExtraAndroidPackage: {
        "type": "string",
        "minlength": 1,
        "maxlength": 50
    },

    appExtraTypeAndroid: {
        "type": "integer",
        "minimum": bllIntf.platforms.ANDROID,
        "maximum": bllIntf.platforms.ANDROID
    },

    timestampTz: {
        "type": "string",
        "pattern": "^20[1-3][0-9]\\-[0-1][0-9]\\-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9] \\+[0-5][0-9]:[0-5][0-9]$"
    },

    boolean: {
        "enum": [true, false]
    }

};