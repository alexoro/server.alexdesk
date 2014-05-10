/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var domain = require('../../../src/index').domain;
var utils = require('./../_utils');


var mock = {
    users: [
        {
            id: '1',
            login: 'test@test.com',
            passwordHash: 'b642b4217b34b1e8d3bd915fc65c4452', // md5 of 'test@test.com'
            name: 'Test',
            registered: new Date('2014-05-01 12:00:00 +04:00'),
            lastVisit: new Date('2014-05-01 14:00:00 +04:00')
        }
    ],

    system_access_tokens: [
        {
            token: '142b2b49-75f2-456f-9533-435bd0ef94c0',
            userType: domain.userTypes.SERVICE_USER,
            userId: '1',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
        },
        {
            token: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a',
            userType: domain.userTypes.APP_USER,
            userId: '2',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
        },
        {
            token: '390582c6-a59b-4ab2-a8e1-87fdbb291b97',
            userType: domain.userTypes.APP_USER,
            userId: '3',
            expires: new Date('1970-01-01 00:00:00 +00:00').getTime()
        }
    ],


    apps: [
        {
            id: '1',
            platformType: domain.platforms.ANDROID,
            title: 'Test App',
            created: new Date('2014-05-01 13:00:00 +04:00'),
            isApproved: true,
            isBlocked: false,
            isDeleted: false
        }
    ],

    app_info_extra_android: [
        {
            appId: '1',
            package: 'com.testapp'
        }
    ],

    app_acl: [
        {
            appId: '1',
            userId: '1',
            isOwner: true
        }
    ],

    app_users: [
        {
            appUserId: '2',
            appId: '1',
            login: 'test1',
            passwordHash: '5a105e8b9d40e1329780d62ea2265d8a',
            name: 'Test user #1',
            registered: new Date('2012-05-01 13:00:00 +00:00'),
            lastVisit: new Date('2012-05-01 13:26:00 +00:00')
        },
        {
            appUserId: '3',
            appId: '1',
            login: 'test2',
            passwordHash: 'ad0234829205b9033196ba818f7a872b',
            name: 'Test user #2',
            registered: new Date('2012-05-01 13:05:00 +00:00'),
            lastVisit: new Date('2012-05-01 13:50:00 +00:00')
        }
    ],

    app_users_extra_android: [
        {
            appId: '1',
            appUserId: '2',
            deviceUuid: 'b97f0733069901955d4bae2c674d2fcd',
            gcmToken: ''
        },
        {
            appId: '1',
            appUserId: '3',
            deviceUuid: 'ee55941d72dc69392cd8347be701d730',
            gcmToken: ''
        }
    ],

    chats: [
        {
            id: '1',
            appId: '1',
            userCreatorId: '2',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:20:00 +00:00'),
            title: '',
            type: domain.chatTypes.UNKNOWN,
            status: domain.chatStatuses.UNKNOWN,
            lastUpdate: new Date('2012-05-01 13:10:05 +00:00')
        },
        {
            id: '2',
            appId: '1',
            userCreatorId: '2',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:20:00 +00:00'),
            title: '',
            type: domain.chatTypes.UNKNOWN,
            status: domain.chatStatuses.UNKNOWN,
            lastUpdate: new Date('2012-05-01 13:26:00 +00:00')
        },
        {
            id: '3',
            appId: '1',
            userCreatorId: '3',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:20:00 +00:00'),
            title: '',
            type: domain.chatTypes.UNKNOWN,
            status: domain.chatStatuses.UNKNOWN,
            lastUpdate: new Date('2012-05-01 13:50:00 +00:00')
        }
    ],

    chat_extra_android: [
        {
            chatId: '1',
            appId: '1',
            countryId: domain.countries.getIdByCode('ru'),
            langId: domain.languages.getIdByCode('ru'),
            api: 10,
            apiTextValue: 'Gingerbird',
            appBuild: 1,
            appVersion: '1.0',
            deviceManufacturer: 'Samsung',
            deviceModel: 'S5',
            deviceWidthPx: 1280,
            deviceHeightPx: 1920,
            deviceDensity: 320,
            isRooted: false,
            metaData: ''
        },
        {
            chatId: '2',
            appId: '1',
            countryId: domain.countries.getIdByCode('ru'),
            langId: domain.languages.getIdByCode('ru'),
            api: 10,
            apiTextValue: 'Gingerbird',
            appBuild: 1,
            appVersion: '1.0',
            deviceManufacturer: 'Samsung',
            deviceModel: 'S5',
            deviceWidthPx: 1280,
            deviceHeightPx: 1920,
            deviceDensity: 320,
            isRooted: false,
            metaData: ''
        },
        {
            chatId: '3',
            appId: '1',
            countryId: domain.countries.getIdByCode('ru'),
            langId: domain.languages.getIdByCode('ru'),
            api: 17,
            apiTextValue: 'KitKat',
            appBuild: 1,
            appVersion: '1.0',
            deviceManufacturer: 'LG',
            deviceModel: 'Nexus 4',
            deviceWidthPx: 720,
            deviceHeightPx: 1280,
            deviceDensity: 240,
            isRooted: true,
            metaData: ''
        }
    ],

    chat_participants: [
        {chatId: '1', userType: domain.userTypes.SERVICE_USER, userId: '1', lastVisit: new Date('2012-05-01 13:10:05 +00:00')},
        {chatId: '1', userType: domain.userTypes.APP_USER, userId: '2', lastVisit: new Date('2012-05-01 13:12:00 +00:00')},

        {chatId: '2', userType: domain.userTypes.SERVICE_USER, userId: '1', lastVisit: new Date('2012-05-01 13:25:00 +00:00')},
        {chatId: '2', userType: domain.userTypes.APP_USER, userId: '2', lastVisit: new Date('2012-05-01 13:26:00 +00:00')},

        {chatId: '3', userType: domain.userTypes.SERVICE_USER, userId: '1', lastVisit: new Date('2012-05-01 13:50:00 +00:00')},
        {chatId: '3', userType: domain.userTypes.APP_USER, userId: '1', lastVisit: new Date('2012-05-01 13:40:00 +00:00')}
    ],


    chat_messages: [
        {
            id: '1',
            appId: '1',
            chatId: '1',
            userCreatorId: '2',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:10:00 +00:00'),
            content: 'I have question #1'
        },
        {
            id: '2',
            appId: '1',
            chatId: '1',
            userCreatorId: '1',
            userCreatorType: domain.userTypes.SERVICE_USER,
            created: new Date('2012-05-01 13:10:05 +00:00'),
            content: 'I have answer #1'
        },

        {
            id: '3',
            appId: '1',
            chatId: '2',
            userCreatorId: '2',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:20:00 +00:00'),
            content: 'I have question #1 again'
        },
        {
            id: '4',
            appId: '1',
            chatId: '2',
            userCreatorId: '2',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:22:00 +00:00'),
            content: 'Hey you'
        },
        {
            id: '5',
            appId: '1',
            chatId: '2',
            userCreatorId: '1',
            userCreatorType: domain.userTypes.SERVICE_USER,
            created: new Date('2012-05-01 13:25:00 +00:00'),
            content: 'Wait a minute. Here it is'
        },
        {
            id: '6',
            appId: '1',
            chatId: '2',
            userCreatorId: '2',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:26:00 +00:00'),
            content: 'Oh! Thanks'
        },

        {
            id: '7',
            appId: '1',
            chatId: '3',
            userCreatorId: '1',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:40:00 +00:00'),
            content: 'I have a question #2'
        },
        {
            id: '8',
            appId: '1',
            chatId: '3',
            userCreatorId: '1',
            userCreatorType: domain.userTypes.SERVICE_USER,
            created: new Date('2012-05-01 13:50:00 +00:00'),
            content: 'I have answer #2'
        }
    ]

};

module.exports = {
    getCopy: function() {
        return utils.deepClone(mock);
    }
}