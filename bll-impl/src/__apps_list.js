/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

var _ = require('underscore');
var async = require('async');


/*
---- Input data:
{
    access_token: "142b2b49-75f2-456f-9533-435bd0ef94c0"
}

---- Output data:
[
    {
        id: "0fd44c33-951a-4f2c-8fb3-6faf41970cb1",
        title: "Test App",
        created: "2012-04-30 12:00:00 +04:00",
        number_of_chats: 3,
        number_of_all_messages: 8
        number_of_unread_messages: 1,
        platform_type: 2,
        extra: {
            package: 'com.testapp'
        }
    },
    ...
]
*/

var AppsList = function(DAL) {
    this.dal = DAL;
};

AppsList.prototype.execute = function(args, done) {
    var self = this;
    var apps = {};
    var userId;

    var fnStack = [
        function(cb) {
            self.dal.getUserIdByToken(args.access_token, function(err, result) {
                userId = result;
                cb(err);
            });
        },
        function(cb) {
            self.dal.getAppsList(userId, function(err, result) {
                if (err) {
                    cb(err);
                } else {
                    for (var i = 0; i < result.length; i++) {
                        apps[result[i].id] = result[i];
                    }
                    cb();
                }
            });
        },

        function(cb) {
            self.dal.getNumberOfChats(_.keys(apps), function(err, result) {
                if (!err) {
                    _.keys(result).forEach(function(item) {
                        apps[item].number_of_chats = result[item];
                    });
                }
                cb(err);
            });
        },
        function(cb) {
            self.dal.getNumberOfAllMessages(_.keys(apps), function(err, result) {
                if (!err) {
                    _.keys(result).forEach(function(item) {
                        apps[item].number_of_all_messages = result[item];
                    });
                }
                cb(err);
            });
        },
        function(cb) {
            self.dal.getNumberOfUnreadMessages(_.keys(apps), function(err, result) {
                if (!err) {
                    _.keys(result).forEach(function(item) {
                        apps[item].number_of_unread_messages = result[item];
                    });
                }
                cb(err);
            });
        }
    ];

    async.series(
        fnStack,
        function(err) {
            if (err) {
                done(err, null);
            } else {
                done(null, _.values(apps));
            }
        }
    );
};


module.exports = function(args, next) {
    next(null, getResult());
};

function getResult() {
    return [];
}