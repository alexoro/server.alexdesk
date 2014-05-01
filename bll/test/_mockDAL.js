/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var _ = require('underscore');

var bll = require('../');
var platforms = bll.platforms;

var utils = require('./_utils');
var mockData =  require('./_mockData');


var DAL = function() {

};


DAL.prototype.getUserIdByToken = function(accessToken, done) {
    var r = _.findWhere(mockData.system_access_tokens, {id: accessToken});
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
    var err;

    var appsIds = _.where(mockData.app_acl, {user_id: userId});
    var apps = [];

    utils.forEach(appsIds, function(item) {
        var app = _.findWhere(mockData.apps, {id: item.app_id});
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
            var extra = _.findWhere(mockData, {app_id: app.id});
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

DAL.prototype.getNumberOfConversations = function(appIds, done) {

};

DAL.prototype.getNumberOfAllMessages = function(appIds, done) {

};

DAL.prototype.getNumberOfUnreadMessages = function(userId, appIds, done) {

};