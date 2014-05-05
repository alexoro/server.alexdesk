/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

var _ = require('underscore');
var async = require('async');
var tv4 = require('tv4');

var bllIntf = require('../../bll-interface');
var bllErr = bllIntf.errors;
var bllErrBuilder = bllIntf.errorBuilder;

var validate = require('./_validation');


var AppsList = function(DAL) {
    this.dal = DAL;
};

AppsList.prototype.execute = function(args, done) {
    var self = this;
    var apps = {};
    var user;

    var fnStack = [
        function(cb) {
            self.dal.getUserMainInfoByToken(args.access_token, function(err, result) {
                if (!err && !result) {
                    err = bllErrBuilder(bllErr.INVALID_OR_EXPIRED_TOKEN, 'Specified access token "' + args.access_token + '" is expired or invalid');
                }
                user = result;
                cb(err);
            });
        },
        function(cb) {
            if (user.type !== bllIntf.userTypes.SERVICE_USER) {
                cb(bllErrBuilder(bllErr.ACCESS_DENIED, 'Only service user has access to this command. Given access token is: ' + args.access_token));
            } else {
                cb();
            }
        },

        function(cb) {
            self.dal.getAppsList(user.id, function(err, result) {
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
            self.dal.getNumberOfUnreadMessages(_.keys(apps), user.type, user.id, function(err, result) {
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


var validateArgsHasErrors = function(args) {
    if (args.access_token === undefined) {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'Access token is not defined');
    }
    if (!validate.accessToken(args.access_token)) {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'Incorrect access token value: ' + args.access_token);
    }
};

module.exports = function(dal, args, next) {
    var argsError = validateArgsHasErrors(args);
    if (argsError) {
        next(argsError, null);
    } else {
        var inst = new AppsList(dal);
        inst.execute(args, next);
    }
};