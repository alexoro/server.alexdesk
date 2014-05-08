/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var domain = require('../../').domain;
var utils = require('./_utils');


var mock = {
    users: [
        {
            id: '1',
            login: 'test@test.com',
            passwordHash: 'b642b4217b34b1e8d3bd915fc65c4452', // md5 of 'test@test.com'
            name: 'Test',
            registered: new Date('2014-05-01 12:00:00 +04:00'),
            last_visit: new Date('2014-05-01 14:00:00 +04:00')
        }
    ],

    system_access_tokens: [
        {
            token: '142b2b49-75f2-456f-9533-435bd0ef94c0',
            user_type: domain.userTypes.SERVICE_USER,
            user_id: '1',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
        },
        {
            token: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a',
            user_type: domain.userTypes.APP_USER,
            user_id: '2',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
        },
        {
            token: '390582c6-a59b-4ab2-a8e1-87fdbb291b97',
            user_type: domain.userTypes.APP_USER,
            user_id: '3',
            expires: new Date('1970-01-01 00:00:00 +00:00').getTime()
        }
    ],


    apps: [
        {
            id: '1',
            platform_type: domain.platforms.ANDROID,
            title: 'Test App',
            created: new Date('2014-05-01 13:00:00 +04:00'),
            is_approved: true,
            is_blocked: false,
            is_deleted: false
        }
    ],

    app_info_extra_android: [
        {
            app_id: '1',
            package: 'com.testapp'
        }
    ],

    app_acl: [
        {
            app_id: '1',
            user_id: '1',
            is_owner: true
        }
    ],

    app_users: [
        {
            app_user_id: '2',
            app_id: '1',
            login: 'test1',
            password: '5a105e8b9d40e1329780d62ea2265d8a',
            name: 'Test user #1',
            registered: new Date('2012-05-01 13:00:00 +00:00'),
            last_visit: new Date('2012-05-01 13:26:00 +00:00')
        },
        {
            app_user_id: '3',
            app_id: '1',
            login: 'test2',
            password: 'ad0234829205b9033196ba818f7a872b',
            name: 'Test user #2',
            registered: new Date('2012-05-01 13:05:00 +00:00'),
            last_visit: new Date('2012-05-01 13:50:00 +00:00')
        }
    ],

    app_users_extra_android: [
        {
            app_id: '1',
            app_user_id: '2',
            device_uuid: 'b97f0733069901955d4bae2c674d2fcd',
            gcm_token: ''
        },
        {
            app_id: '1',
            app_user_id: '3',
            device_uuid: 'ee55941d72dc69392cd8347be701d730',
            gcm_token: ''
        }
    ],

    chats: [
        {
            id: '1',
            app_id: '1',
            user_creator_id: '2',
            user_creator_type: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:20:00 +00:00'),
            title: '',
            type: domain.chatTypes.UNKNOWN,
            status: domain.chatStatuses.UNKNOWN,
            last_update: new Date('2012-05-01 13:10:05 +00:00')
        },
        {
            id: '2',
            app_id: '1',
            user_creator_id: '2',
            user_creator_type: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:20:00 +00:00'),
            title: '',
            type: domain.chatTypes.UNKNOWN,
            status: domain.chatStatuses.UNKNOWN,
            last_update: new Date('2012-05-01 13:26:00 +00:00')
        },
        {
            id: '3',
            app_id: '1',
            user_creator_id: '3',
            user_creator_type: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:20:00 +00:00'),
            title: '',
            type: domain.chatTypes.UNKNOWN,
            status: domain.chatStatuses.UNKNOWN,
            last_update: new Date('2012-05-01 13:50:00 +00:00')
        }
    ],

    chat_extra_android: [
        {
            chat_id: '1',
            app_id: '1',
            country_id: domain.countries.getIdByCode('ru'),
            lang_id: domain.languages.getIdByCode('ru'),
            api: 10,
            api_text_value: 'Gingerbird',
            app_build: 1,
            app_version: '1.0',
            device_manufacturer: 'Samsung',
            device_model: 'S5',
            device_width_px: 1280,
            device_height_px: 1920,
            device_density: 320,
            is_rooted: false,
            meta_data: ''
        },
        {
            chat_id: '2',
            app_id: '1',
            country_id: domain.countries.getIdByCode('ru'),
            lang_id: domain.languages.getIdByCode('ru'),
            api: 10,
            api_text_value: 'Gingerbird',
            app_build: 1,
            app_version: '1.0',
            device_manufacturer: 'Samsung',
            device_model: 'S5',
            device_width_px: 1280,
            device_height_px: 1920,
            device_density: 320,
            is_rooted: false,
            meta_data: ''
        },
        {
            chat_id: '3',
            app_id: '1',
            country_id: domain.countries.getIdByCode('ru'),
            lang_id: domain.languages.getIdByCode('ru'),
            api: 17,
            api_text_value: 'KitKat',
            app_build: 1,
            app_version: '1.0',
            device_manufacturer: 'LG',
            device_model: 'Nexus 4',
            device_width_px: 720,
            device_height_px: 1280,
            device_density: 240,
            is_rooted: true,
            meta_data: ''
        }
    ],

    chat_participants: [
        {chat_id: '1', user_type: domain.userTypes.SERVICE_USER, user_id: '1', last_visit: new Date('2012-05-01 13:10:05 +00:00')},
        {chat_id: '1', user_type: domain.userTypes.APP_USER, user_id: '2', last_visit: new Date('2012-05-01 13:12:00 +00:00')},

        {chat_id: '2', user_type: domain.userTypes.SERVICE_USER, user_id: '1', last_visit: new Date('2012-05-01 13:25:00 +00:00')},
        {chat_id: '2', user_type: domain.userTypes.APP_USER, user_id: '2', last_visit: new Date('2012-05-01 13:26:00 +00:00')},

        {chat_id: '3', user_type: domain.userTypes.SERVICE_USER, user_id: '1', last_visit: new Date('2012-05-01 13:50:00 +00:00')},
        {chat_id: '3', user_type: domain.userTypes.APP_USER, user_id: '1', last_visit: new Date('2012-05-01 13:40:00 +00:00')}
    ],


    chat_messages: [
        {
            id: '1',
            app_id: '1',
            chat_id: '1',
            user_creator_id: '2',
            user_creator_type: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:10:00 +00:00'),
            content: 'I have question #1'
        },
        {
            id: '2',
            app_id: '1',
            chat_id: '1',
            user_creator_id: '1',
            user_creator_type: domain.userTypes.SERVICE_USER,
            created: new Date('2012-05-01 13:10:05 +00:00'),
            content: 'I have answer #1'
        },

        {
            id: '3',
            app_id: '1',
            chat_id: '2',
            user_creator_id: '2',
            user_creator_type: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:20:00 +00:00'),
            content: 'I have question #1 again'
        },
        {
            id: '4',
            app_id: '1',
            chat_id: '2',
            user_creator_id: '2',
            user_creator_type: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:22:00 +00:00'),
            content: 'Hey you'
        },
        {
            id: '5',
            app_id: '1',
            chat_id: '2',
            user_creator_id: '1',
            user_creator_type: domain.userTypes.SERVICE_USER,
            created: new Date('2012-05-01 13:25:00 +00:00'),
            content: 'Wait a minute. Here it is'
        },
        {
            id: '6',
            app_id: '1',
            chat_id: '2',
            user_creator_id: '2',
            user_creator_type: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:26:00 +00:00'),
            content: 'Oh! Thanks'
        },

        {
            id: '7',
            app_id: '1',
            chat_id: '3',
            user_creator_id: '1',
            user_creator_type: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:40:00 +00:00'),
            content: 'I have a question #2'
        },
        {
            id: '8',
            app_id: '1',
            chat_id: '3',
            user_creator_id: '1',
            user_creator_type: domain.userTypes.SERVICE_USER,
            created: new Date('2012-05-01 13:50:00 +00:00'),
            content: 'I have answer #2'
        }
    ]

};

module.exports = {
    getCopy: function() {
        //return Object.create(mock);
        return utils.deepClone(mock);
    }
}