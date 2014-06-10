/**
 * Created by UAS on 01.05.2014.
 */

"use strict";


var domain = require('../../../src/index').domain;
var deepClone = require('./_deepClone');


var mock = {
    users: [
        {
            id: '1',
            login: 'test@test.com',
            passwordHash: 'b642b4217b34b1e8d3bd915fc65c4452', // md5 of 'test@test.com'
            name: 'Test',
            registered: new Date('2014-05-01 12:00:00 +04:00'),
            lastVisit: new Date('2014-05-01 14:00:00 +04:00'),
            isConfirmed: true
        },
        {
            id: '2',
            login: '2@2.com',
            passwordHash: '1e6fd8e56879c84999cd481255530592',
            name: 'Test #2',
            registered: new Date('2014-05-01 12:00:00 +04:00'),
            lastVisit: new Date('2014-05-01 14:00:00 +04:00'),
            isConfirmed: true
        },
        {
            id: '3',
            login: '3@3.com',
            passwordHash: '317fe8b099749d32b8eea573565842d5',
            name: 'Test #3',
            registered: new Date('2014-05-01 12:00:00 +04:00'),
            lastVisit: new Date('2014-05-01 14:00:00 +04:00'),
            isConfirmed: false
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
            token: 'b6e84344-74e0-43f3-83e0-6a16c3fe6b5d',
            userType: domain.userTypes.SERVICE_USER,
            userId: '3',
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

    system_register_confirm: [
        {
            id: '0cec4d47-d9a1-4984-8f23-10583b674123',
            serviceUserId: '1',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
        },
        {
            id: 'de72bca0-1c76-444d-9b1a-ad1f84d04dfb',
            serviceUserId: '3',
            expires: new Date('2000-01-01 00:00:00 +00:00').getTime()
        },
        {
            id: '5ece1f7a-c5d0-4a09-97b6-00e8d88a04a1',
            serviceUserId: '3',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
        }
    ],

    system_reset_password_confirm: [
        {
            id: 'a1df4350-5fcb-4377-8bfb-6576801cda51',
            serviceUserId: '1',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
        },
        {
            id: '86fb45f6-2bd4-4918-bd6b-887b6d51b0a9',
            serviceUserId: '1',
            expires: new Date('2000-01-01 00:00:00 +00:00').getTime()
        },
        {
            id: 'd8463bf9-0af6-4db6-86b7-f9c366cc289e',
            serviceUserId: '3',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
        },
        {
            id: '5e604462-4f09-4077-afe7-d84bcdb5004e',
            serviceUserId: '100',
            expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
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
        },
        {
            id: '2',
            platformType: domain.platforms.ANDROID,
            title: 'Test App #2',
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
        },
        {
            appId: '2',
            package: 'com.testapp2'
        }
    ],

    app_acl: [
        {
            appId: '1',
            userId: '1',
            isOwner: true
        },
        {
            appId: '2',
            userId: '2',
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
        },
        {
            appUserId: '4',
            appId: '2',
            login: 'test1_2',
            passwordHash: '262deb6b64eea95f6502c0604624472f',
            name: 'Test user #1 for App #2',
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
        },
        {
            appId: '2',
            appUserId: '4',
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
        },
        {
            id: '4',
            appId: '2',
            userCreatorId: '4',
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
        },
        {
            chatId: '4',
            appId: '2',
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
        {chatId: '1', userType: domain.userTypes.SERVICE_USER, userId: '1'},
        {chatId: '1', userType: domain.userTypes.APP_USER, userId: '2'},

        {chatId: '2', userType: domain.userTypes.SERVICE_USER, userId: '1'},
        {chatId: '2', userType: domain.userTypes.APP_USER, userId: '2'},

        {chatId: '3', userType: domain.userTypes.SERVICE_USER, userId: '1'},
        {chatId: '3', userType: domain.userTypes.APP_USER, userId: '3'},

        {chatId: '4', userType: domain.userTypes.SERVICE_USER, userId: '2'},
        {chatId: '4', userType: domain.userTypes.APP_USER, userId: '4'}
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
            userCreatorId: '3',
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
        },

        {
            id: '9',
            appId: '2',
            chatId: '4',
            userCreatorId: '4',
            userCreatorType: domain.userTypes.APP_USER,
            created: new Date('2012-05-01 13:50:00 +00:00'),
            content: 'I have question for app #2'
        }
    ],

    chat_messages_extra: [
        {messageId: '1', appId: '1', chatId: '1', userType: domain.userTypes.SERVICE_USER, userId: '1', isRead: true},
        {messageId: '1', appId: '1', chatId: '1', userType: domain.userTypes.APP_USER, userId: '2', isRead: true},
        {messageId: '2', appId: '1', chatId: '1', userType: domain.userTypes.SERVICE_USER, userId: '1', isRead: true},
        {messageId: '2', appId: '1', chatId: '1', userType: domain.userTypes.APP_USER, userId: '2', isRead: true},

        {messageId: '3', appId: '1', chatId: '2', userType: domain.userTypes.SERVICE_USER, userId: '1', isRead: true},
        {messageId: '3', appId: '1', chatId: '2', userType: domain.userTypes.APP_USER, userId: '2', isRead: true},
        {messageId: '4', appId: '1', chatId: '2', userType: domain.userTypes.SERVICE_USER, userId: '1', isRead: true},
        {messageId: '4', appId: '1', chatId: '2', userType: domain.userTypes.APP_USER, userId: '2', isRead: true},
        {messageId: '5', appId: '1', chatId: '2', userType: domain.userTypes.SERVICE_USER, userId: '1', isRead: true},
        {messageId: '5', appId: '1', chatId: '2', userType: domain.userTypes.APP_USER, userId: '2', isRead: true},
        {messageId: '6', appId: '1', chatId: '2', userType: domain.userTypes.SERVICE_USER, userId: '1', isRead: false},
        {messageId: '6', appId: '1', chatId: '2', userType: domain.userTypes.APP_USER, userId: '2', isRead: true},

        {messageId: '7', appId: '1', chatId: '3', userType: domain.userTypes.SERVICE_USER, userId: '1', isRead: true},
        {messageId: '7', appId: '1', chatId: '3', userType: domain.userTypes.APP_USER, userId: '3', isRead: true},
        {messageId: '8', appId: '1', chatId: '3', userType: domain.userTypes.SERVICE_USER, userId: '1', isRead: true},
        {messageId: '8', appId: '1', chatId: '3', userType: domain.userTypes.APP_USER, userId: '3', isRead: false},

        {messageId: '9', appId: '2', chatId: '4', userType: domain.userTypes.SERVICE_USER, userId: '2', isRead: false},
        {messageId: '9', appId: '2', chatId: '4', userType: domain.userTypes.APP_USER, userId: '4', isRead: true}
    ]

};

module.exports = {
    getCopy: function() {
        return deepClone(mock);
    }
};