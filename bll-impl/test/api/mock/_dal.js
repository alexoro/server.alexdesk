/**
 * Created by UAS on 01.05.2014.
 */

"use strict";


var _ = require('underscore');

var domain = require('../../../src/index').domain;
var dPlatforms = domain.platforms;

var utils = require('./../_utils');


var DAL = function(mockData) {
    this.mock = mockData;
};


DAL.prototype.userGetIdByToken = function(args, done) {
    var reqArgs = {
        token: args.token
    };

    var r = _.findWhere(this.mock.system_access_tokens, reqArgs);
    if (r) {
        var dateNow = new Date();
        var dateUser = r.expires;
        if (dateNow.getTime() >= dateUser) {
            return done(null, null);
        } else {
            return done(null, {type: r.userType, id: r.userId});
        }
    } else {
        return done(null, null);
    }
};

DAL.prototype.authTokenCreate = function(args, done) {
    var data = {
        token: args.token,
        userType: args.userType,
        userId: args.userId,
        expires: args.expires
    };
    this.mock.system_access_tokens.push(data);
    done(null);
};


DAL.prototype.serviceUserGetCreditionalsByLogin = function(args, done) {
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
    var reqArgs = {
        id: args.id
    };

    var r = _.findWhere(this.mock.users, reqArgs);
    done(null, r === undefined ? null : r);
};

DAL.prototype.serviceUserCreate = function(args, done) {
    var data = {
        id: args.id,
        login: args.login,
        passwordHash: args.passwordHash,
        name: args.name,
        registered: utils.deepClone(args.registered),
        lastVisit: utils.deepClone(args.lastVisit),
        isConfirmed: args.isConfirmed
    };
    this.mock.users.push(data);
    done(null);
};

DAL.prototype.serviceUserUpdatePasswordHash = function (args, done) {
    var r = _.findWhere(this.mock.users, {id: args.userId});
    if (!r) {
        done(new Error('User not found'));
    } else {
        r.passwordHash = args.passwordHash;
        done(null);
    }
};


DAL.prototype.serviceUserGetRegisterConfirmData = function(args, done) {
    var reqArgs = {
        id: args.confirmToken
    };
    var r = _.findWhere(this.mock.system_register_confirm, reqArgs);
    if (!r) {
        done(null, null);
    } else {
        var ret = {
            id: r.id,
            userId: r.serviceUserId,
            expires: r.expires
        };
        done(null, ret);
    }
};

DAL.prototype.serviceUserCreateRegisterConfirmData = function(args, done) {
    var data = {
        id: args.id,
        serviceUserId: args.userId,
        expires: args.expires
    };
    this.mock.system_register_confirm.push(data);
    done(null);
};

DAL.prototype.serviceUserMarkAsConfirmed = function(args, done) {
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


DAL.prototype.serviceUserGetResetPasswordConfirmData = function(args, done) {
    var reqArgs = {
        id: args.confirmToken
    };
    var r = _.findWhere(this.mock.system_reset_password_confirm, reqArgs);
    if (!r) {
        done(null, null);
    } else {
        var ret = {
            id: r.id,
            userId: r.serviceUserId,
            expires: r.expires
        };
        done(null, ret);
    }
};

DAL.prototype.serviceUserCreateResetPasswordConfirmData = function(args, done) {
    var data = {
        id: args.id,
        serviceUserId: args.userId,
        expires: args.expires
    };
    this.mock.system_reset_password_confirm.push(data);
    done(null);
};


DAL.prototype.appsGetList = function(args, done) {
    var self = this;
    var err;

    var appsIds = _.where(this.mock.app_acl, {userId: args.userId});
    var apps = [];

    utils.forEach(appsIds, function(item) {
        var app = _.findWhere(self.mock.apps, {id: item.appId});
        if (!app) {
            err = new Error('We found owner for application, but this application is not exists');
            return false;
        } else {
            apps.push(app);
        }
    });
    if (err) {
        return done(err, null);
    }

    apps = utils.deepClone(apps);
    utils.forEach(apps, function(app) {
        if (app.platformType === dPlatforms.ANDROID) {
            var extra = _.findWhere(self.mock.app_info_extra_android, {appId: app.id});
            if (!extra) {
                err = new Error('We found the android application, but extra information did not found');
                return false;
            } else {
                app.extra = {
                    package: extra.package
                };
            }
        } else {
            app.extra = {};
        }
    });
    if (err) {
        return done(err, null);
    }

    return done(null, apps);
};

DAL.prototype.appIsExists = function(args, done) {
    var r = _.findWhere(this.mock.apps, {id: args.appId});
    if (!r) {
        done(null, false);
    } else {
        done(null, true);
    }
};

DAL.prototype.appGetOwnerIdAppId = function(args, done) {
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

DAL.prototype.appCreate = function(args, done) {
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

DAL.prototype.appsGetNumberOfChats = function(args, done) {
    var self = this;
    var r = {};
    utils.forEach(args.appIds, function(item) {
        r[item] = _.where(self.mock.chats, {appId: item}).length;
    });
    done(null, r);
};

DAL.prototype.appsGetNumberOfMessages = function(args, done) {
    var self = this;
    var r = {};
    utils.forEach(args.appIds, function(item) {
        r[item] = _.where(self.mock.chat_messages, {appId: item}).length;
    });
    done(null, r);
};

DAL.prototype.appsGetNumberOfUnreadMessages = function(args, done) {
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


DAL.prototype.appUserGetCreditionalsByLogin = function(args, done) {
    var r = _.findWhere(this.mock.app_users, {appId: args.appId, login: args.login});
    if (!r) {
        done(null, null);
    } else {
        done(null, {id: r.appUserId, login: r.login, passwordHash: r.passwordHash});
    }
};

DAL.prototype.appUsersGetProfileById = function(args, done) {
    var user = _.findWhere(this.mock.app_users, {appUserId: args.id});
    if (!user) {
        done(null, null);
    } else {
        user = utils.deepClone(user);

        user.platform = domain.platforms.ANDROID;
        var extra = _.findWhere(this.mock.app_users_extra_android, {appUserId: args.id});
        user.extra = {
            deviceUuid: extra.deviceUuid,
            gcmToken: extra.gcmToken
        };
        user.id = user.appUserId;
        delete user.appUserId;
        done(null, user);
    }
};

DAL.prototype.appUsersCreate = function(args, done) {
    args = args.profile;
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

DAL.prototype.appUserUpdate = function(args, done) {
    args = args.profile;
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


DAL.prototype.chatsGetList = function(args, done) {
    var chats = !!args.userCreatorId ?
        _.where(this.mock.chats, {appId: args.appId, userCreatorId: args.userCreatorId})
        : _.where(this.mock.chats, {appId: args.appId});

    chats = chats.sort(function(a, b) {
        return a.lastUpdate.getTime() > b.lastUpdate.getTime();
    });

    chats = chats.slice(args.offset, args.limit);
    chats = utils.deepClone(chats);

    var app = _.findWhere(this.mock.apps, {id: args.appId});
    var appPlatform;
    if (!app) {
        return done(new Error('Application is not found. Given id: ' + args.appId));
    } else {
        appPlatform = app.platformType;
    }

    for (var i = 0; i < chats.length; i++) {
        if (appPlatform === dPlatforms.ANDROID) {
            var extra = _.findWhere(this.mock.chat_extra_android, {chatId: chats[i].id});
            if (!extra) {
                return done(new Error('No extra information is found for Android application and chat: ' + chats[i].id));
            } else {
                delete extra.chatId;
                delete extra.appId;
                chats[i].extra = extra;
            }
        } else {
            chats.extra = {};
        }
    }

    done(null, chats);
};

DAL.prototype.chatIsExists = function(args, done) {
    done(null, !!_.findWhere(this.mock.chats, {id: args.chatId}));
};

DAL.prototype.chatGetAppId = function(args, done) {
    var chat = _.findWhere(this.mock.chats, {id: args.chatId});
    if (!chat) {
        done(new Error('Chat is not found. Given ID: ' + args.chatId));
    } else {
        done(null, chat.appId);
    }
};

DAL.prototype.chatIsUserTheCreator = function(args, done) {
    done(null, !!_.findWhere(this.mock.chats, {id: args.chatId, userCreatorId: args.userId, userCreatorType: args.userType}));
};

DAL.prototype.chatsGetNumberOfUnreadMessagesPerChatForUser = function(args, done) {
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

DAL.prototype.chatsGetLastMessagePerChat = function(args, done) {
    var r = {};
    _.each(args.chatIds, function(item) {
        r[item] = null;
    });

    for (var i = 0; i < this.mock.chat_messages.length; i++) {
        var item = utils.deepClone(this.mock.chat_messages[i]);
        r[item.chatId] = item;
    }

    done(null, r);
};

DAL.prototype.chatUpdateLastVisit = function(args, done) {
    var reqArgs = {
        chatId: args.chatId,
        userType: args.userType,
        userId: args.userId
    };
    var r = _.findWhere(this.mock.chat_participants, reqArgs);
    r.lastVisit = args.newLastVisit;
    done(null);
};

DAL.prototype.chatCreateWithMessage = function(args, done) {
    var argsNewChat = utils.deepClone(args.newChat);
    var argsNewMessage = utils.deepClone(args.newMessage);
    var argsParticipants = utils.deepClone(args.participants);

    var newChat = {
        id: argsNewChat.id,
        appId: argsNewChat.appId,
        userCreatorId: argsNewChat.userCreatorId,
        userCreatorType: argsNewChat.userCreatorType,
        created: argsNewChat.created,
        title: argsNewChat.title,
        type: argsNewChat.type,
        status: argsNewChat.status,
        lastUpdate: argsNewChat.lastUpdate
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

    var newChatParticipants = [
        {
            chatId: argsNewChat.id,
            userId: argsParticipants[0].userId,
            userType: argsParticipants[0].userType,
            lastVisit: argsParticipants[0].lastVisit
        },
        {
            chatId: argsNewChat.id,
            userId: argsParticipants[1].userId,
            userType: argsParticipants[1].userType,
            lastVisit: argsParticipants[1].lastVisit
        }
    ];

    var newMessage = {
        id: argsNewMessage.id,
        appId: argsNewChat.appId,
        chatId: argsNewChat.id,
        userCreatorId: argsNewChat.userCreatorId,
        userCreatorType: argsNewChat.userCreatorType,
        created: argsNewMessage.created,
        content: argsNewMessage.content
    };

    this.mock.chats.push(newChat);
    if (newChatExtraAndroid) {
        this.mock.chat_extra_android.push(newChatExtraAndroid);
    }
    this.mock.chat_participants.push(newChatParticipants[0]);
    this.mock.chat_participants.push(newChatParticipants[1]);
    this.mock.chat_messages.push(newMessage);

    done();
};


DAL.prototype.messagesGetListForChat = function(args, done) {
    var chatId = args.chatId;
    var offset = args.offset;
    var limit = args.limit;

    var r = _.where(this.mock.chat_messages, {chatId: chatId})
        .slice(offset)
        .splice(0, limit);
    r = utils.deepClone(r);

    for (var i = 0; i < r.length; i++) {
        delete r[i].appId;
        delete r[i].chatId;
    }

    done(null, r);
};

DAL.prototype.messagesGetIsReadPerMessageForUser = function (args, done) {
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

DAL.prototype.messagesSetIsReadInChatForUser = function (args, done) {
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

DAL.prototype.messageCreateAndUpdateLastVisit = function(args, done) {
    var msg = utils.deepClone(args.newMessage);
    this.mock.chat_messages.push(msg);

    var reqArgs = {
        chatId: msg.chatId,
        userType: msg.userCreatorType,
        userId: msg.userCreatorId,
        newLastVisit: msg.created
    };
    this.chatUpdateLastVisit(reqArgs, function(err) {
        if (err) {
            done(err);
        } else {
            done();
        }
    });
};


module.exports = DAL;