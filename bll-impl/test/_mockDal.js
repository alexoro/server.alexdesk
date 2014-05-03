/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var _ = require('underscore');

var bllInterface = require('../../bll-interface');
var platforms = bllInterface.platforms;

var utils = require('./_utils');


var DAL = function(mockData) {
    this.mock = mockData;
};


DAL.prototype.getUserIdByToken = function(accessToken, done) {
    var r = _.findWhere(this.mock.system_access_tokens, {id: accessToken});
    if (r) {
        var dateNow = new Date();
        var dateUser = new Date(r.expires);
        if (dateNow.getTime() >= dateUser.getTime()) {
            return done(null, null);
        } else {
            return done(null, r.user_id);
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
        if (app.platform_type === platforms.ANDROID) {
            var extra = _.findWhere(self.mock, {app_id: app.id});
            if (!extra) {
                err = new Error('We found the android application, but extra information did not found');
                return false;
            } else {
                app.extra = extra;
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
    var chatParticipant = _.findWhere(this.mock.chat_participants, {user_type: userType, user_id: userId});
    if (!chatParticipant) {
        return done(new Error('Specified user is declared as chat participant'), null);
    }
    var userLastVisit = new Date(chatParticipant.last_visit);

    var r = {};
    utils.forEach(appIds, function(appId) {
        r[appId] = 0;
        utils.forEach(self.mock.chat_messages, function(message) {
            if (message.app_id === appId &&
                message.user_creator_type === userType &&
                message.user_creator_id === userId &&
                userLastVisit.getTime() <= message.created) {
                r[appId]++;
            }
        });
    });

    return done(null, r);
};


module.exports = DAL;