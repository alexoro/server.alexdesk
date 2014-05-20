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

DAL.prototype.isAppExists = function(appId, done) {
    var r = _.findWhere(this.mock.apps, {id: appId});
    if (!r) {
        done(null, false);
    } else {
        done(null, true);
    }
};

DAL.prototype.getAppType = function(appId, done) {
    var r = _.findWhere(this.mock.apps, {id: appId});
    if (!r) {
        done(new Error('Application is not found. Given id: ' + appId));
    } else {
        done(null, r.platformType);
    }
};

DAL.prototype.userIsAssociatedWithApp = function(appId, userType, userId, done) {
    var r;
    if (userType === domain.userTypes.SERVICE_USER) {
        r = _.findWhere(this.mock.app_acl, {appId: appId, userId: userId, isOwner: true});
        done(null, !!r);
    } else if (userType === domain.userTypes.APP_USER) {
        r = _.findWhere(this.mock.app_users, {appUserId: userId, appId: appId});
        done(null, !!r);
    } else {
        done(new Error('Unknown userType: ' + userType));
    }
};

DAL.prototype.getServiceUserIdByCreditionals = function(creditionals, done) {
    var r = _.findWhere(this.mock.users, creditionals);
    if (!r) {
        done(null, null);
    } else {
        done(null, r.id);
    }
};

DAL.prototype.getAppUserIdByCreditionals = function(creditionals, done) {
    var r = _.findWhere(this.mock.app_users, creditionals);
    if (!r) {
        done(null, null);
    } else {
        done(null, r.appUserId);
    }
};

DAL.prototype.createAuthToken = function(args, done) {
    this.mock.system_access_tokens.push(args);
    done(null);
};

DAL.prototype.getUserMainInfoByToken = function(token, done) {
    var r = _.findWhere(this.mock.system_access_tokens, {token: token});
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

DAL.prototype.getAppOwnerUserMainInfoByAppId = function(args, done) {
    var r = _.findWhere(this.mock.app_acl, {appId: args.appId, isOwner: true});
    if (r) {
        var ret = {
            id: r.userId,
            type: domain.userTypes.SERVICE_USER
        };
        return done(null, ret);
    } else {
        return done(null, null);
    }
};

DAL.prototype.getAppsList = function(userId, done) {
    var self = this;
    var err;

    var appsIds = _.where(this.mock.app_acl, {userId: userId});
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

DAL.prototype.getNumberOfChats = function(appIds, done) {
    var self = this;
    var r = {};
    utils.forEach(appIds, function(item) {
        r[item] = _.where(self.mock.chats, {appId: item}).length;
    });
    done(null, r);
};

DAL.prototype.getNumberOfAllMessages = function(appIds, done) {
    var self = this;
    var r = {};
    utils.forEach(appIds, function(item) {
        r[item] = _.where(self.mock.chat_messages, {appId: item}).length;
    });
    done(null, r);
};

DAL.prototype.getNumberOfUnreadMessages = function(appIds, userType, userId, done) {
    var self = this;

    var chatsLastVisit = {};
    _.where(this.mock.chat_participants, {userType: userType, userId: userId}).forEach(function(item) {
        chatsLastVisit[item.chatId] = new Date(item.lastVisit);
    });

    var r = {};
    utils.forEach(appIds, function(appId) {
        r[appId] = 0;
        utils.forEach(self.mock.chat_messages, function(message) {
            if (message.appId === appId &&
                message.userCreatorType !== userType &&
                message.userCreatorId !== userId &&
                chatsLastVisit[message.chatId].getTime() < message.created.getTime()) {
                r[appId]++;
            }
        });
    });

    return done(null, r);
};

DAL.prototype.getChatsList = function(args, done) {
    var chats = !!args.userCreatorId ?
        _.where(this.mock.chats, {appId: args.appId, userCreatorId: args.userCreatorId})
        : _.where(this.mock.chats, {appId: args.appId});

    chats = chats.sort(function(a, b) {
        return a.lastUpdate.getTime() > b.lastUpdate.getTime();
    });

    chats = chats.slice(args.offset, args.limit);
    chats = utils.deepClone(chats);

    var self = this;
    this.getAppType(args.appId, function(err, appType) {
        if (err) {
            return done(err);
        }

        for (var i = 0; i < chats.length; i++) {
            if (appType === dPlatforms.ANDROID) {
                var extra = _.findWhere(self.mock.chat_extra_android, {chatId: chats[i].id});
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
    });
};

DAL.prototype.isChatExists = function(args, done) {
    done(null, !!_.findWhere(this.mock.chats, {id: args.chatId}));
};

DAL.prototype.getAppIdChatBelongsTo = function(args, done) {
    var chat = _.findWhere(this.mock.chats, {id: args.chatId});
    if (!chat) {
        done(new Error('Chat is not found. Given ID: ' + args.chatId));
    } else {
        done(null, chat.appId);
    }
};

DAL.prototype.isUserTheCreatorOfChat = function(args, done) {
    done(null, !!_.findWhere(this.mock.chats, {id: args.chatId, userCreatorId: args.userId, userCreatorType: args.userType}));
};

DAL.prototype.getMessagesList = function(args, done) {
    var chatId = args.chatId;
    var offset = args.offset;
    var limit = args.limit;

    var r = _.where(this.mock.chat_messages, {chatId: chatId})
        .slice(offset)
        .splice(0, limit);

    done(null, utils.deepClone(r));
};

DAL.prototype.getNumberOfUnreadMessagesPerChats = function(args, done) {
    var chatIds = args.chatIds;
    var userType = args.userType;
    var userId = args.userId;
    var i;
    var item;

    var r = {};
    _.each(chatIds, function(item) {
        r[item] = 0;
    });

    var lastVisits = {};
    for (i = 0; i < chatIds.length; i++) {
        item = _.findWhere(this.mock.chat_participants, {userType: userType, userId: userId, chatId: chatIds[i]});
        lastVisits[chatIds[i]] = item.lastVisit;
    }

    for (i = 0; i < this.mock.chat_messages.length; i++) {
        item = this.mock.chat_messages[i];
        if (_.contains(chatIds, item.chatId) &&
            !(item.userCreatorType === userType && item.userCreatorId === userId) &&
            item.created.getTime() > lastVisits[item.chatId].getTime()) {
            r[item.chatId]++;
        }
    }

    return done(null, r);
};

DAL.prototype.getLastMessagePerChats = function(chatIds, done) {
    var r = {};
    _.each(chatIds, function(item) {
        r[item] = null;
    });

    for (var i = 0; i < this.mock.chat_messages.length; i++) {
        var item = utils.deepClone(this.mock.chat_messages[i]);
        r[item.chatId] = item;
    }

    done(null, r);
};

DAL.prototype.getLastVisitOfUserToChat = function(args, done) {
    var r = _.findWhere(this.mock.chat_participants, args);
    if (!r) {
        done(null, null);
    } else {
        done(null, r.lastVisit);
    }
};

DAL.prototype.updateLastVisitForChat = function(args, done) {
    var reqArgs = {
        chatId: args.chatId,
        userType: args.userType,
        userId: args.userId
    };
    var r = _.findWhere(this.mock.chat_participants, reqArgs);
    r.lastVisit = args.newLastVisit;
    done(null);
};

DAL.prototype.createMessageInChatAndUpdateLastVisit = function(args, done) {
    var msg = utils.deepClone(args.newMessage);
    this.mock.chat_messages.push(msg);

    var reqArgs = {
        chatId: msg.chatId,
        userType: msg.userCreatorType,
        userId: msg.userCreatorId,
        newLastVisit: msg.created
    };
    this.updateLastVisitForChat(reqArgs, function(err) {
        if (err) {
            done(err);
        } else {
            done();
        }
    });
};

DAL.prototype.createChatWithMessage = function(args, done) {
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


module.exports = DAL;