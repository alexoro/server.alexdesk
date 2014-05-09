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

DAL.prototype.getServiceUserIdByCreditionals = function(creditionals, done) {
    var r = _.findWhere(this.mock.users, creditionals);
    if (!r) {
        done(null, null);
    } else {
        done(null, r.id);
    }
};

DAL.prototype.createAuthToken = function(args, done) {
    var obj = {
        token: args.token,
        user_type: args.user_type,
        user_id: args.user_id,
        expires: args.expires
    };
    this.mock.system_access_tokens.push(obj);
    done(null);
};

DAL.prototype.getUserMainInfoByToken = function(accessToken, done) {
    var r = _.findWhere(this.mock.system_access_tokens, {token: accessToken});
    if (r) {
        var dateNow = new Date();
        var dateUser = r.expires;
        if (dateNow.getTime() >= dateUser) {
            return done(null, null);
        } else {
            return done(null, {type: r.user_type, id: r.user_id});
        }
    } else {
        return done(null, null);
    }
};

DAL.prototype.getAppsList = function(userId, done) {
    var self = this;
    var err;

    var appsIds = _.where(this.mock.app_acl, {user_id: userId});
    var apps = [];

    utils.forEach(appsIds, function(item) {
        var app = _.findWhere(self.mock.apps, {id: item.app_id});
        if (!app) {
            err = domain.errorBuilder(domain.errors.LOGIC_ERROR, 'We found owner for application, but this application is not exists');
            return false;
        } else {
            apps.push(app);
        }
    });
    if (err) {
        return done(err, null);
    }

    utils.forEach(apps, function(app) {
        if (app.platform_type === dPlatforms.ANDROID) {
            var extra = _.findWhere(self.mock.app_info_extra_android, {app_id: app.id});
            if (!extra) {
                err = domain.errorBuilder(domain.errors.LOGIC_ERROR, 'We found the android application, but extra information did not found');
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
        r[item] = _.where(self.mock.chats, {app_id: item}).length;
    });
    done(null, r);
};

DAL.prototype.getNumberOfAllMessages = function(appIds, done) {
    var self = this;
    var r = {};
    utils.forEach(appIds, function(item) {
        r[item] = _.where(self.mock.chat_messages, {app_id: item}).length;
    });
    done(null, r);
};

DAL.prototype.getNumberOfUnreadMessages = function(appIds, userType, userId, done) {
    var self = this;

    var chatsLastVisit = {};
    _.where(this.mock.chat_participants, {user_type: userType, user_id: userId}).forEach(function(item) {
        chatsLastVisit[item.chat_id] = new Date(item.last_visit);
    });

    var r = {};
    utils.forEach(appIds, function(appId) {
        r[appId] = 0;
        utils.forEach(self.mock.chat_messages, function(message) {
            if (message.app_id === appId &&
                message.user_creator_type !== userType &&
                message.user_creator_id !== userId &&
                chatsLastVisit[message.chat_id].getTime() < message.created.getTime()) {
                r[appId]++;
            }
        });
    });

    return done(null, r);
};


module.exports = DAL;