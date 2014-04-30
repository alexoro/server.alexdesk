/**
 * Created by UAS on 01.05.2014.
 */

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
            "number_of_conversations": common.positiveInt,
            "number_of_all_messages": common.positiveInt,
            "number_of_unread_messages": common.positiveInt,
            "platform_type": common.platformType,
            "extra": {
                "type": "object",
                "oneOf": [
                    {},
                    {
                        "properties": {
                            "package": common.appExtraAndroid
                        }
                    }
                ]
            }
        }
    }
};