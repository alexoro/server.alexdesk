/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

var _ = require('underscore');
var async = require('async');

var domain = require('../domain');

var validate = require('./_validation');
var errBuilder = require('./_errorBuilder');


var _validateArgsHasErrors = function(env, args) {
    var dErr = domain.errors;

    if (!args) {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments are not defined');
    }
    if (typeof args !== 'object') {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object');
    }
    if (args.access_token === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Access token is not defined');
    }
    if (!validate.accessToken(args.access_token)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + args.access_token);
    }
};

var _appsFetching = function(env, args, next) {
    var apps = {};
    var user;

    var dal = env.dal;
    var dUserTypes = domain.userTypes;
    var dErr = domain.errors;

    var fnStack = [
        function(cb) {
            dal.getUserMainInfoByToken(args.access_token, function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!result) {
                    cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Specified access token "' + args.access_token + '" is expired or invalid'));
                } else {
                    user = result;
                    cb();
                }
            });
        },
        function(cb) {
            if (user.type !== dUserTypes.SERVICE_USER) {
                cb(errBuilder(dErr.ACCESS_DENIED, 'Only service user has access to this command. Given access token is: ' + args.access_token));
            } else {
                cb();
            }
        },

        function(cb) {
            dal.getAppsList(user.id, function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
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
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    _.keys(result).forEach(function(item) {
                        apps[item].number_of_chats = result[item];
                    });
                    cb();
                }
            });
        },
        function(cb) {
            dal.getNumberOfAllMessages(_.keys(apps), function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    _.keys(result).forEach(function(item) {
                        apps[item].number_of_all_messages = result[item];
                    });
                    cb();
                }
            });
        },
        function(cb) {
            dal.getNumberOfUnreadMessages(_.keys(apps), user.type, user.id, function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    _.keys(result).forEach(function(item) {
                        apps[item].number_of_unread_messages = result[item];
                    });
                    cb();
                }
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


module.exports = function(env, args, next) {
    var argsError = _validateArgsHasErrors(env, args);
    if (argsError) {
        next(argsError, null);
    } else {
        _appsFetching(env, args, next);
    }
};