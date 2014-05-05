/**
 * Created by UAS on 05.05.2014.
 */

"use strict";

/* DEBUG REQUEST
 /v1/
 {
 "jsonrpc": "2.0",
 "method": "security.createAuthToken",
 "id": 1,
 "params": {
 "email": "abcdef@app1.tracid.net",
 "password": "random"
 }}
 ----
 {
 "token": "0123456789abcdef0123456789abcdef",
 "expires": 1375053875
 }
 */


var _ = require('underscore');
var async = require('async');

var bllIntf = require('../../bll-interface');
var bllErr = bllIntf.errors;
var bllErrBuilder = bllIntf.errorBuilder;

var validate = require('./_validation');


var _validateArgsHasErrors = function(args) {
    if (!args) {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'Arguments are not defined');
    }
    if (typeof args !== 'object') {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'Arguments is not a object');
    }
    if (args.user_type === undefined || args.login === undefined || args.password === undefined) {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'Not all required fields are set');
    }
    if (args.user_type !== bllIntf.userTypes.SERVICE_USER && args.user_type !== bllIntf.userTypes.APP_USER) {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'User type is not a service user or application user');
    }

    if (args.user_type === bllIntf.userTypes.SERVICE_USER && !validate.email(args.login)) {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'Service user login must be in email format');
    }
    if (args.user_type === bllIntf.userTypes.APP_USER && !validate.app_user_login(args.login)) {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'Application user login must be a string with length [1, 64]');
    }

    if (!validate.app_user_password(args.password)) {
        return bllIntf.errorBuilder(bllIntf.errors.INVALID_PARAMS, 'Password must be a string with length [1, 64]');
    }
};

var _appsFetching = function(dal, args, next) {
    var apps = {};
    var user;

    var fnStack = [
        function(cb) {
            dal.getUserMainInfoByToken(args.access_token, function(err, result) {
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
            dal.getAppsList(user.id, function(err, result) {
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
            dal.getNumberOfChats(_.keys(apps), function(err, result) {
                if (!err) {
                    _.keys(result).forEach(function(item) {
                        apps[item].number_of_chats = result[item];
                    });
                }
                cb(err);
            });
        },
        function(cb) {
            dal.getNumberOfAllMessages(_.keys(apps), function(err, result) {
                if (!err) {
                    _.keys(result).forEach(function(item) {
                        apps[item].number_of_all_messages = result[item];
                    });
                }
                cb(err);
            });
        },
        function(cb) {
            dal.getNumberOfUnreadMessages(_.keys(apps), user.type, user.id, function(err, result) {
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
                next(err, null);
            } else {
                next(null, _.values(apps));
            }
        }
    );
};


module.exports = function(dal, args, next) {
    var argsError = _validateArgsHasErrors(args);
    if (argsError) {
        next(argsError, null);
    } else {
        next(null, null);
        //_appsFetching(dal, args, next);
    }
};