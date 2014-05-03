/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var common = require('./_common');


module.exports = {
    "type": "array",
    "required": true,
    "items": {
        "type": "object",
        "properties": {
            "id": common.guid,
            "title": common.appName,
            "created": common.timestampTz,
            "is_approved": common.boolean,
            "is_blocked": common.boolean,
            "is_deleted": common.boolean,
            "number_of_chats": common.positiveInt,
            "number_of_all_messages": common.positiveInt,
            "number_of_unread_messages": common.positiveInt,
            "platform_type": common.platformType,
            "extra": {
                "type": "object",
                "oneOf": [
                    {
                        "properties": {
                            "type": common.appExtraTypeAndroid,
                            "package": common.appExtraAndroidPackage
                        }
                    }
                ]
            }
        }
    }
};