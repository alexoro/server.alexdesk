/**
 * Created by UAS on 01.05.2014.
 */

"use strict";


var _ = require('underscore');

var domain = require('../../../src/index').domain;

var deepClone = require('./_deepClone');


var DAL = function(mockData) {
    this.mock = mockData;
};


DAL.prototype.authToken_getUserInfoByToken = function(args, done) {
    args = deepClone(args);
    var reqArgs = {
        token: args.token
    };

    var r = _.findWhere(this.mock.system_access_tokens, reqArgs);
    if (r) {
        var ret = {
            type: r.userType,
            id: r.userId,
            expires: deepClone(r.expires)
        };
        done(null, ret);
    } else {
        done(null, null);
    }
};

DAL.prototype.authToken_create = function(args, done) {
    args = deepClone(args);
    var data = {
        token: args.token,
        userType: args.userType,
        userId: args.userId,
        expires: args.expires
    };
    this.mock.system_access_tokens.push(data);
    done(null);
};


DAL.prototype.serviceUserGetCredentialsByLogin = function(args, done) {
    args = deepClone(args);
    var reqArgs = {
        login: args.login
    };

    var r = _.findWhere(this.mock.users, reqArgs);
    if (!r) {
        done(null, null);
    } else {
        var ret = {
            id: r.id,
            login: r.login,
            passwordHash: r.passwordHash
        };
        done(null, ret);
    }
};

DAL.prototype.serviceUserGetProfileById = function (args, done) {
    args = deepClone(args);
    var reqArgs = {
        id: args.id
    };

    var r = _.findWhere(this.mock.users, reqArgs);
    if (r !== undefined) {
        var ret = {
            id: r.id,
            login: r.login,
            passwordHash: r.passwordHash,
            name: r.name,
            registered: r.registered,
            lastVisit: r.lastVisit,
            isConfirmed: r.isConfirmed
        };
        done(null, ret);
    } else {
        done(null, null);
    }
};

DAL.prototype.serviceUserCreate = function(args, done) {
    args = deepClone(args);
    var data = {
        id: args.id,
        login: args.login,
        passwordHash: args.passwordHash,
        name: args.name,
        registered: deepClone(args.registered),
        lastVisit: deepClone(args.lastVisit),
        isConfirmed: args.isConfirmed
    };
    this.mock.users.push(data);
    done(null);
};

DAL.prototype.serviceUserUpdatePasswordHash = function (args, done) {
    args = deepClone(args);
    var r = _.findWhere(this.mock.users, {id: args.userId});
    if (!r) {
        done(new Error('User not found'));
    } else {
        r.passwordHash = args.passwordHash;
        done(null);
    }
};


DAL.prototype.serviceUsers_registerConfirmDataGet = function(args, done) {
    args = deepClone(args);
    var reqArgs = {
        id: args.token
    };

    var r = _.findWhere(this.mock.system_register_confirm, reqArgs);
    if (!r) {
        done(null, null);
    } else {
        var ret = {
            token: r.token,
            userId: r.serviceUserId,
            expires: r.expires
        };
        done(null, ret);
    }
};

DAL.prototype.serviceUsers_registerConfirmDataCreate = function(args, done) {
    args = deepClone(args);
    var data = {
        token: args.token,
        serviceUserId: args.userId,
        expires: args.expires
    };
    this.mock.system_register_confirm.push(data);
    done(null);
};

DAL.prototype.serviceUsers_markAsConfirmed = function(args, done) {
    args = deepClone(args);
    var reqArgs = {
        id: args.userId
    };

    var user = _.findWhere(this.mock.users, reqArgs);
    if (!user) {
        done(new Error('User is not found'));
    } else {
        user.isConfirmed = true;
        done(null);
    }
};


DAL.prototype.serviceUsers_resetPasswordConfirmDataGet = function(args, done) {
    args = deepClone(args);
    var search = {
        id: args.token
    };

    var r = _.findWhere(this.mock.system_reset_password_confirm, search);
    if (!r) {
        done(null, null);
    } else {
        var ret = {
            token: r.token,
            userId: r.serviceUserId,
            expires: r.expires
        };
        done(null, ret);
    }
};

DAL.prototype.serviceUsers_resetPasswordConfirmDataCreate = function(args, done) {
    args = deepClone(args);
    var data = {
        id: args.token,
        serviceUserId: args.userId,
        expires: args.expires
    };
    this.mock.system_reset_password_confirm.push(data);
    done(null);
};


DAL.prototype.apps_getListForServiceUser = function(args, done) {
    var i;
    var app;

    var appsAcl = _.where(this.mock.app_acl, {userId: args.userId});
    var apps = [];
    for (i = 0; i < appsAcl.length; i++) {
        app = _.findWhere(this.mock.apps, {id: appsAcl[i].appId});
        if (!app) {
            return done(Error('We found owner for application, but this application is not exists'));
        } else {
            apps.push(app);
        }
    }

    var ret = [];
    for (i = 0; i < apps.length; i++) {
        app = {
            id: apps[i].id,
            platformType: apps[i].platformType,
            title: apps[i].title,
            created: deepClone(apps[i].created),
            isApproved: apps[i].isApproved,
            isBlocked: apps[i].isBlocked,
            isDeleted: apps[i].isDeleted
        };

        if (app.platformType === domain.platforms.ANDROID) {
            var extra = _.findWhere(this.mock.app_info_extra_android, {appId: app.id});
            if (!extra) {
                return done(new Error('We found the android application, but extra information did not found'));
            } else {
                app.extra = {
                    package: extra.package
                };
            }
        } else {
            app.extra = {};
        }

        ret.push(app);
    }

    return done(null, ret);
};

DAL.prototype.apps_isExists = function(args, done) {
    args = deepClone(args);
    done(null, !!_.findWhere(this.mock.apps, {id: args.appId}));
};

DAL.prototype.apps_getOwnerIdForAppById = function(args, done) {
    args = deepClone(args);
    var r = _.findWhere(this.mock.app_acl, {appId: args.appId, isOwner: true});
    if (r) {
        var ret = {
            id: r.userId,
            type: domain.userTypes.SERVICE_USER
        };
        done(null, ret);
    } else {
        done(null, null);
    }
};

DAL.prototype.apps_create = function(args, done) {
    args = deepClone(args);
    var app = {
        id: args.id,
        platformType: args.platform,
        title: args.title,
        created: args.created,
        isApproved: args.isApproved,
        isBlocked: args.isBlocked,
        isDeleted: args.isDeleted
    };
    this.mock.apps.push(app);

    var acl = {
        appId: args.id,
        userId: args.ownerUserId,
        isOwner: true
    };
    this.mock.app_acl.push(acl);

    if (args.platform === domain.platforms.ANDROID) {
        var extra = {
            appId: args.id,
            package: args.extra.package
        };
        this.mock.app_info_extra_android.push(extra);
    }

    done(null);
};

DAL.prototype.apps_getNumberOfChats = function(args, done) {
    args = deepClone(args);
    var r = {};
    for (var i = 0; i < args.appIds.length; i++) {
        r[args.appIds[i]] = _.where(this.mock.chats, {appId: args.appIds[i]}).length;
    }
    done(null, r);
};

DAL.prototype.apps_getNumberOfMessages = function(args, done) {
    args = deepClone(args);
    var r = {};
    for (var i = 0; i < args.appIds.length; i++) {
        r[args.appIds[i]] = _.where(this.mock.chat_messages, {appId: args.appIds[i]}).length;
    }
    done(null, r);
};

DAL.prototype.apps_getNumberOfUnreadMessages = function(args, done) {
    args = deepClone(args);
    var r = {};
    for (var i = 0; i < args.appIds.length; i++) {
        var search = {
            appId: args.appIds[i],
            userType: args.userType,
            userId: args.userId,
            isRead: false
        };
        r[args.appIds[i]] = _.where(this.mock.chat_messages_extra, search).length;
    }
    done(null, r);
};


DAL.prototype.appUsers_getCredentialsByLogin = function(args, done) {
    args = deepClone(args);
    var r = _.findWhere(this.mock.app_users, {appId: args.appId, login: args.login});
    if (!r) {
        done(null, null);
    } else {
        var ret = {
            id: r.appUserId,
            login: r.login,
            passwordHash: r.passwordHash
        };
        done(null, ret);
    }
};

DAL.prototype.appUsers_getProfileById = function(args, done) {
    args = deepClone(args);
    var user = _.findWhere(this.mock.app_users, {appUserId: args.id});
    if (!user) {
        done(null, null);
    } else {
        user = deepClone(user);
        var ret = {
            id: user.appUserId,
            appId: user.appId,
            login: user.login,
            passwordHash: user.passwordHash,
            name: user.name,
            registered: user.registered,
            lastVisit: user.lastVisit,
            platform: domain.platforms.ANDROID,
            extra: {}
        };

        var extra = _.findWhere(this.mock.app_users_extra_android, {appUserId: ret.id});
        ret.extra = {
            deviceUuid: extra.deviceUuid,
            gcmToken: extra.gcmToken
        };
        done(null, ret);
    }
};

DAL.prototype.appUsers_create = function(args, done) {
    args = deepClone(args);
    var profile = {
        appUserId: args.id,
        appId: args.appId,
        login: args.login,
        passwordHash: args.passwordHash,
        name: args.name,
        registered: args.registered,
        lastVisit: args.lastVisit
    };
    this.mock.app_users.push(profile);

    if (args.platform === domain.platforms.ANDROID) {
        var extra = {
            appId: args.appId,
            appUserId: args.id,
            deviceUuid: args.extra.deviceUuid,
            gcmToken: args.extra.gcmToken
        };
        this.mock.app_users_extra_android.push(extra);
    }

    done(null);
};

DAL.prototype.appUsers_update = function(args, done) {
    args = deepClone(args);
    var i;

    var profile = {
        appUserId: args.id,
        appId: args.appId,
        login: args.login,
        passwordHash: args.passwordHash,
        name: args.name,
        registered: args.registered,
        lastVisit: args.lastVisit
    };
    for (i = 0; i < this.mock.app_users.length; i++) {
        if (this.mock.app_users[i].appUserId === profile.appUserId) {
            this.mock.app_users[i] = profile;
            break;
        }
    }

    if (args.platform === domain.platforms.ANDROID) {
        var extra = {
            appId: args.appId,
            appUserId: args.id,
            deviceUuid: args.extra.deviceUuid,
            gcmToken: args.extra.gcmToken
        };
        for (i = 0; i < this.mock.app_users_extra_android.length; i++) {
            if (this.mock.app_users_extra_android[i].appUserId === profile.appUserId) {
                this.mock.app_users_extra_android[i] = extra;
                break;
            }
        }
    }

    done(null);
};

DAL.prototype.chats_getListWithLastMessageOrderByLastMessageCreatedAsc = function(args, done) {
    args = deepClone(args);
    var i;

    var chats = !!args.userCreatorId ?
        _.where(this.mock.chats, {appId: args.appId, userCreatorId: args.userCreatorId, userCreatorType: args.userCreatorType})
        : _.where(this.mock.chats, {appId: args.appId});

    chats = chats.sort(function(a, b) {
        return a.lastUpdate.getTime() - b.lastUpdate.getTime();
    });
    chats = chats.slice(args.offset).splice(0, args.limit);

    var app = _.findWhere(this.mock.apps, {id: args.appId});
    if (!app) {
        return done(new Error('Application is not found. Given id: ' + args.appId));
    }

    var ret = [];
    for (i = 0; i < chats.length; i++) {
        var chat = {
            id: chats[i].id,
            appId: chats[i].appId,
            userCreatorId: chats[i].userCreatorId,
            userCreatorType: chats[i].userCreatorType,
            created: deepClone(chats[i].created),
            title: chats[i].title,
            type: chats[i].type,
            status: chats[i].status,
            extra: {}
        };

        if (app.platformType === domain.platforms.ANDROID) {
            var extra = _.findWhere(this.mock.chat_extra_android, {chatId: chats[i].id});
            if (!extra) {
                return done(new Error('No extra information is found for Android application and chat: ' + chats[i].id));
            } else {
                chat.extra = {
                    countryId: extra.countryId,
                    langId: extra.langId,
                    api: extra.api,
                    apiTextValue: extra.apiTextValue,
                    appBuild: extra.appBuild,
                    appVersion: extra.appVersion,
                    deviceManufacturer: extra.deviceManufacturer,
                    deviceModel: extra.deviceModel,
                    deviceWidthPx: extra.deviceWidthPx,
                    deviceHeightPx: extra.deviceHeightPx,
                    deviceDensity: extra.deviceDensity,
                    isRooted: extra.isRooted,
                    metaData: extra.metaData
                };
            }
        }
        ret.push(chat);
    }

    for (i = 0; i < ret.length; i++) {
        for (var j = 0; j < this.mock.chat_messages.length; j++) {
            var msg = this.mock.chat_messages[j];
            if (msg.chatId === ret[i].id) {
                ret[i].lastMessage = {
                    id: msg.id,
                    chatId: msg.chatId,
                    userCreatorId: msg.userCreatorId,
                    userCreatorType: msg.userCreatorType,
                    created: deepClone(msg.created),
                    content: msg.content
                };
            }
        }
    }

    done(null, ret);
};

DAL.prototype.chats_isExists = function(args, done) {
    args = deepClone(args);
    done(null, !!_.findWhere(this.mock.chats, {id: args.chatId}));
};

DAL.prototype.chats_getAppId = function(args, done) {
    args = deepClone(args);
    var chat = _.findWhere(this.mock.chats, {id: args.chatId});
    if (!chat) {
        done(new Error('Chat is not found. Given ID: ' + args.chatId));
    } else {
        done(null, chat.appId);
    }
};

DAL.prototype.chats_isUserTheCreator = function(args, done) {
    args = deepClone(args);
    var search = {
        id: args.chatId,
        userCreatorId: args.userId,
        userCreatorType: args.userType
    };
    done(null, !!_.findWhere(this.mock.chats, search));
};

DAL.prototype.chats_getNumberOfUnreadMessagesPerChatForUser = function(args, done) {
    args = deepClone(args);
    var r = {};
    for (var i = 0; i < args.chatIds.length; i++) {
        var search = {
            chatId: args.chatIds[i],
            userType: args.userType,
            userId: args.userId,
            isRead: false
        };
        r[args.chatIds[i]] = _.where(this.mock.chat_messages_extra, search).length;
    }

    done(null, r);
};

DAL.prototype.chats_getLastMessagePerChat = function(args, done) {
    args = deepClone(args);

    var r = {};
    for (var i = 0; i < this.mock.chat_messages.length; i++) {
        var item = deepClone(this.mock.chat_messages[i]);
        if (args.chatIds.indexOf(item.chatId) >= 0) {
            r[item.chatId] = {
                id: item.id,
                chatId: item.chatId,
                userCreatorId: item.userCreatorId,
                userCreatorType: item.userCreatorType,
                created: deepClone(item.created),
                content: item.content
            };
        }
    }

    done(null, r);
};

DAL.prototype.chats_getParticipantsInfo = function (args, done) {
    args = deepClone(args);
    var collection = _.where(this.mock.chat_participants, {chatId: args.chatId});
    var r = [];
    _.each(collection, function (item) {
        r.push({
            type: item.userType,
            id: item.userId
        });
    });
    done(null, r);
};

DAL.prototype.chats_createWithMessage = function(args, done) {
    args = deepClone(args);
    var argsNewChat = deepClone(args.newChat);
    var argsNewMessage = deepClone(args.newMessage);

    var newChat = {
        id: argsNewChat.id,
        appId: argsNewChat.appId,
        userCreatorId: argsNewChat.userCreatorId,
        userCreatorType: argsNewChat.userCreatorType,
        created: argsNewChat.created,
        title: argsNewChat.title,
        type: argsNewChat.type,
        status: argsNewChat.status,
        lastUpdate: argsNewChat.created
    };

    var newChatExtraAndroid = null;
    if (argsNewChat.platform === domain.platforms.ANDROID) {
        newChatExtraAndroid  = {
            chatId: argsNewChat.id,
            appId: argsNewChat.appId,
            countryId: argsNewChat.extra.countryId,
            langId: argsNewChat.extra.langId,
            api: argsNewChat.extra.api,
            apiTextValue: argsNewChat.extra.apiTextValue,
            appBuild: argsNewChat.extra.appBuild,
            appVersion: argsNewChat.extra.appVersion,
            deviceManufacturer: argsNewChat.extra.deviceManufacturer,
            deviceModel: argsNewChat.extra.deviceModel,
            deviceWidthPx: argsNewChat.extra.deviceWidthPx,
            deviceHeightPx: argsNewChat.extra.deviceHeightPx,
            deviceDensity: argsNewChat.extra.deviceDensity,
            isRooted: argsNewChat.extra.isRooted,
            metaData: argsNewChat.extra.metaData
        };
    }

    var newChatParticipants = [];
    for (var i = 0; i < argsNewChat.participants.length; i++) {
        newChatParticipants.push({
            chatId: argsNewChat.id,
            userId: argsNewChat.participants[i].userId,
            userType: argsNewChat.participants[i].userType
        });
    }

    var newMessage = {
        id: argsNewMessage.id,
        appId: argsNewChat.appId,
        chatId: argsNewMessage.chatId,
        userCreatorId: argsNewChat.userCreatorId,
        userCreatorType: argsNewChat.userCreatorType,
        created: argsNewMessage.created,
        content: argsNewMessage.content
    };
    var newMessageExtraIsRead = [
        {
            appId: argsNewChat.appId,
            chatId: argsNewChat.id,
            messageId: argsNewMessage.id,
            userType: argsNewMessage.isRead[0].userType,
            userId: argsNewMessage.isRead[0].userId,
            isRead: argsNewMessage.isRead[0].isRead
        },
        {
            appId: argsNewChat.appId,
            chatId: argsNewChat.id,
            messageId: argsNewMessage.id,
            userType: argsNewMessage.isRead[1].userType,
            userId: argsNewMessage.isRead[1].userId,
            isRead: argsNewMessage.isRead[1].isRead
        }
    ];

    this.mock.chats.push(newChat);
    if (newChatExtraAndroid) {
        this.mock.chat_extra_android.push(newChatExtraAndroid);
    }
    this.mock.chat_participants.push(newChatParticipants[0]);
    this.mock.chat_participants.push(newChatParticipants[1]);
    this.mock.chat_messages.push(newMessage);
    this.mock.chat_messages_extra.push(newMessageExtraIsRead[0]);
    this.mock.chat_messages_extra.push(newMessageExtraIsRead[1]);

    done(null);
};


DAL.prototype.messages_getListForChatOrderByCreatedAsc = function(args, done) {
    args = deepClone(args);
    var chatId = args.chatId;
    var offset = args.offset;
    var limit = args.limit;

    var messages = _.where(this.mock.chat_messages, {chatId: chatId});
    messages = messages.sort(function(a, b) {
        return a.created.getTime() - b.created.getTime();
    });
    messages = messages.slice(offset).splice(0, limit);
    messages = deepClone(messages);

    var ret = [];
    for (var i = 0; i < messages.length; i++) {
        ret.push({
            id: messages[i].id,
            chatId: messages[i].chatId,
            userCreatorId: messages[i].userCreatorId,
            userCreatorType: messages[i].userCreatorType,
            created: deepClone(messages[i].created),
            content: messages[i].content
        });
    }

    done(null, ret);
};

DAL.prototype.messages_getIsReadPerMessageForUser = function (args, done) {
    args = deepClone(args);
    var r = {};
    for (var i = 0; i < args.messageIds.length; i++) {
        var search = {
            messageId: args.messageIds[i],
            userType: args.userType,
            userId: args.userId
        };
        var item = _.findWhere(this.mock.chat_messages_extra, search);
        if (!item) {
            return done(new Error('Extra info for message is not found. Message ID: ' + args.messageIds[i]));
        }
        r[args.messageIds[i]] = item.isRead;
    }

    done(null, r);
};

DAL.prototype.messages_setIsReadInChatForUser = function (args, done) {
    args = deepClone(args);
    var search = {
        chatId: args.chatId,
        userType: args.userType,
        userId: args.userId
    };
    var data = _.where(this.mock.chat_messages_extra, search);
    for (var i = 0; i < data.length; i++) {
        data[i].isRead = true;
    }
    done(null);
};

DAL.prototype.messages_create = function(args, done) {
    var copy = deepClone(args);

    var chat = _.findWhere(this.mock.chats, {id: copy.chatId});
    if (!chat) {
        return done(new Error('Chat is not found'));
    }

    var newMessage = {
        id: copy.id,
        appId: chat.appId,
        chatId: copy.chatId,
        userCreatorId: copy.userCreatorId,
        userCreatorType: copy.userCreatorType,
        created: copy.created,
        content: copy.content
    };
    this.mock.chat_messages.push(newMessage);

    for (var i = 0; i < copy.isRead.length; i++) {
        this.mock.chat_messages_extra.push({
                appId: chat.appId,
                chatId: copy.chatId,
                messageId: copy.id,
                userType: copy.isRead[i].userType,
                userId: copy.isRead[i].userId,
                isRead: copy.isRead[i].isRead
            });
    }

    _.findWhere(this.mock.chats, {id: copy.chatId}).lastUpdate = copy.created;

    done(null);
};


module.exports = DAL;