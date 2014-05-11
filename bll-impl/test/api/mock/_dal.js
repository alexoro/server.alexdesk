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

DAL.prototype.getChatsList = function(done) {
    done(null, null);
};


module.exports = DAL;