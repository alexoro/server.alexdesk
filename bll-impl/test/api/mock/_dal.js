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
    done(null, r);
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
        var item = this.mock.chat_messages[i];
        r[item.chatId] = item;
        delete item.chatId;
        delete item.appId;
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


module.exports = DAL;