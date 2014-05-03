/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var bllInterface = require('../../bll-interface');

var mock = {
    users: [
        {
            id: '7026e148-fabe-48cf-8d31-378ab00d5a75',
            email: 'test@test.com',
            password: 'b642b4217b34b1e8d3bd915fc65c4452',
            name: 'Test',
            registered: '2014-05-01 12:00:00 +04:00',
            last_visit: '2014-05-01 14:00:00 +04:00'
        }
    ],

    system_access_tokens: [
        {
            id: '142b2b49-75f2-456f-9533-435bd0ef94c0',
            user_type: bllInterface.userTypes.SERVICE_USER,
            user_id: '7026e148-fabe-48cf-8d31-378ab00d5a75',
            expires: '2020-01-01 00:00:00 +00:00'
        },
        {
            id: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a',
            user_type: bllInterface.userTypes.APP_USER,
            user_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            expires: '2020-01-01 00:00:00 +00:00'
        },
        {
            id: '390582c6-a59b-4ab2-a8e1-87fdbb291b97',
            user_type: bllInterface.userTypes.APP_USER,
            user_id: 'f3357dcb-ab92-4420-a682-7d255031f17a',
            expires: '1970-01-01 00:00:00 +00:00'
        }
    ],


    apps: [
        {
            id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            platform_type: bllInterface.platforms.ANDROID,
            title: 'Test App',
            created: '2014-05-01 13:00:00 +04:00',
            is_approved: true,
            is_blocked: false,
            is_deleted: false
        }
    ],

    app_info_extra_android: [
        {
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            package: 'com.testapp'
        }
    ],

    app_acl: [
        {
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            user_id: '7026e148-fabe-48cf-8d31-378ab00d5a75',
            is_owner: true
        }
    ],

    app_users: [
        {
            app_user_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            login: 'test1',
            password: '5a105e8b9d40e1329780d62ea2265d8a',
            name: 'Test user #1',
            registered: '2012-05-01 13:00:00 +00:00',
            last_visit: '2012-05-01 13:26:00 +00:00'
        },
        {
            app_user_id: 'f3357dcb-ab92-4420-a682-7d255031f17a',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            login: 'test2',
            password: 'ad0234829205b9033196ba818f7a872b',
            name: 'Test user #2',
            registered: '2012-05-01 13:05:00 +00:00',
            last_visit: '2012-05-01 13:50:00 +00:00'
        }
    ],

    app_users_extra_android: [
        {
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            app_user_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            device_uuid: 'b97f0733069901955d4bae2c674d2fcd',
            gcm_token: ''
        },
        {
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            app_user_id: 'f3357dcb-ab92-4420-a682-7d255031f17a',
            device_uuid: 'ee55941d72dc69392cd8347be701d730',
            gcm_token: ''
        }
    ],

    chats: [
        {
            id: '00c33874-2fbd-4b13-82fe-f1a623875a99',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            user_creator_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            user_creator_type: bllInterface.userTypes.APP_USER,
            created: '2012-05-01 13:20:00 +00:00',
            title: '',
            type: bllInterface.chatTypes.UNKNOWN,
            status: bllInterface.chatStatuses.UNKNOWN,
            last_update: '2012-05-01 13:10:05 +00:00'
        },
        {
            id: '8aa5740e-d220-40a5-b846-7191b7dd6637',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            user_creator_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            user_creator_type: bllInterface.userTypes.APP_USER,
            created: '2012-05-01 13:20:00 +00:00',
            title: '',
            type: bllInterface.chatTypes.UNKNOWN,
            status: bllInterface.chatStatuses.UNKNOWN,
            last_update: '2012-05-01 13:26:00 +00:00'
        },
        {
            id: '757dbaca-55ed-4c51-ba2f-f8f0aa62f44b',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            user_creator_id: 'f3357dcb-ab92-4420-a682-7d255031f17a',
            user_creator_type: bllInterface.userTypes.APP_USER,
            created: '2012-05-01 13:20:00 +00:00',
            title: '',
            type: bllInterface.chatTypes.UNKNOWN,
            status: bllInterface.chatStatuses.UNKNOWN,
            last_update: '2012-05-01 13:50:00 +00:00'
        }
    ],

    chat_extra_android: [
        {
            chat_id: '00c33874-2fbd-4b13-82fe-f1a623875a99',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            country_id: bllInterface.countries.getIdByCode('ru'),
            lang_id: bllInterface.languages.getIdByCode('ru'),
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
            chat_id: '8aa5740e-d220-40a5-b846-7191b7dd6637',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            country_id: bllInterface.countries.getIdByCode('ru'),
            lang_id: bllInterface.languages.getIdByCode('ru'),
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
            chat_id: '757dbaca-55ed-4c51-ba2f-f8f0aa62f44b',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            country_id: bllInterface.countries.getIdByCode('ru'),
            lang_id: bllInterface.languages.getIdByCode('ru'),
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
        {chat_id: '00c33874-2fbd-4b13-82fe-f1a623875a99', user_type: bllInterface.userTypes.SERVICE_USER, user_id: '7026e148-fabe-48cf-8d31-378ab00d5a75', last_visit: '2012-05-01 13:10:05 +00:00'},
        {chat_id: '00c33874-2fbd-4b13-82fe-f1a623875a99', user_type: bllInterface.userTypes.APP_USER, user_id: '6779c315-bc1e-44ff-892c-8420cf16c82d', last_visit: '2012-05-01 13:12:00 +00:00'},

        {chat_id: '8aa5740e-d220-40a5-b846-7191b7dd6637', user_type: bllInterface.userTypes.SERVICE_USER, user_id: '7026e148-fabe-48cf-8d31-378ab00d5a75', last_visit: '2012-05-01 13:25:00 +00:00'},
        {chat_id: '8aa5740e-d220-40a5-b846-7191b7dd6637', user_type: bllInterface.userTypes.APP_USER, user_id: '6779c315-bc1e-44ff-892c-8420cf16c82d', last_visit: '2012-05-01 13:26:00 +00:00'},

        {chat_id: '757dbaca-55ed-4c51-ba2f-f8f0aa62f44b', user_type: bllInterface.userTypes.SERVICE_USER, user_id: '7026e148-fabe-48cf-8d31-378ab00d5a75', last_visit: '2012-05-01 13:50:00 +00:00'},
        {chat_id: '757dbaca-55ed-4c51-ba2f-f8f0aa62f44b', user_type: bllInterface.userTypes.APP_USER, user_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', last_visit: '2012-05-01 13:40:00 +00:00'}
    ],


    chat_messages: [
        {
            id: 'e17c1552-c35a-41a0-bf36-61bdb2f52bb7',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            chat_id: '00c33874-2fbd-4b13-82fe-f1a623875a99',
            user_creator_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            user_creator_type: bllInterface.userTypes.APP_USER,
            created: '2012-05-01 13:10:00 +00:00',
            content: 'I have question #1'
        },
        {
            id: '79d3ebb6-c72c-460c-92cb-79a6a19cd169',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            chat_id: '00c33874-2fbd-4b13-82fe-f1a623875a99',
            user_creator_id: '7026e148-fabe-48cf-8d31-378ab00d5a75',
            user_creator_type: bllInterface.userTypes.SERVICE_USER,
            created: '2012-05-01 13:10:05 +00:00',
            content: 'I have answer #1'
        },

        {
            id: 'a30c00f1-828f-4f7a-b694-cb9b90f70ade',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            chat_id: '8aa5740e-d220-40a5-b846-7191b7dd6637',
            user_creator_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            user_creator_type: bllInterface.userTypes.APP_USER,
            created: '2012-05-01 13:20:00 +00:00',
            content: 'I have question #1 again'
        },
        {
            id: 'dce9e7fc-c562-4566-9c87-7288e86e3a5e',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            chat_id: '8aa5740e-d220-40a5-b846-7191b7dd6637',
            user_creator_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            user_creator_type: bllInterface.userTypes.APP_USER,
            created: '2012-05-01 13:22:00 +00:00',
            content: 'Hey you'
        },
        {
            id: '1d82d529-4fa9-4dc3-835a-1d3de5440092',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            chat_id: '8aa5740e-d220-40a5-b846-7191b7dd6637',
            user_creator_id: '7026e148-fabe-48cf-8d31-378ab00d5a75',
            user_creator_type: bllInterface.userTypes.SERVICE_USER,
            created: '2012-05-01 13:25:00 +00:00',
            content: 'Wait a minute. Here it is'
        },
        {
            id: '5074c9ff-e671-44fa-8349-974d0dd22a37',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            chat_id: '8aa5740e-d220-40a5-b846-7191b7dd6637',
            user_creator_id: '6779c315-bc1e-44ff-892c-8420cf16c82d',
            user_creator_type: bllInterface.userTypes.APP_USER,
            created: '2012-05-01 13:26:00 +00:00',
            content: 'Oh! Thanks'
        },

        {
            id: '1f3454d3-5fb1-4893-8dfa-301e983b1787',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            chat_id: '757dbaca-55ed-4c51-ba2f-f8f0aa62f44b',
            user_creator_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            user_creator_type: bllInterface.userTypes.APP_USER,
            created: '2012-05-01 13:40:00 +00:00',
            content: 'I have a question #2'
        },
        {
            id: 'a0808c55-3fcd-49fb-9a69-80721c19f17a',
            app_id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
            chat_id: '757dbaca-55ed-4c51-ba2f-f8f0aa62f44b',
            user_creator_id: '7026e148-fabe-48cf-8d31-378ab00d5a75',
            user_creator_type: bllInterface.userTypes.SERVICE_USER,
            created: '2012-05-01 13:50:00 +00:00',
            content: 'I have answer #2'
        }
    ]

};

module.exports = {
    getCopy: function() {
        return Object.create(mock);
    }
}