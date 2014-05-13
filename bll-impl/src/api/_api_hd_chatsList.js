/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

var _ = require('underscore');
var async = require('async');

var domain = require('../domain');

var validate = require('./_validation');
var errBuilder = require('./_errorBuilder');


var defaultOffset = 0;
var defaultLimit = 50;

var minOffset = 0;
var minLimit = 1;
var maxLimit = 50;


var _validateArgsHasErrors = function(env, args) {
    var dErr = domain.errors;

    if (!args) {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments are not defined');
    }
    if (typeof args !== 'object') {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object');
    }

    if (args.accessToken === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Access token is not defined');
    }
    if (args.appId === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Application id is not defined');
    }

    if (!validate.accessToken(args.accessToken)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + args.accessToken);
    }
    if (!validate.appId(args.appId)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect api id value: ' + args.appId);
    }

    if (args.offset !== undefined && !validate.offset(args.offset, minOffset)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Offset is invalid: ' + args.offset);
    }
    if (args.limit !== undefined && !validate.limit(args.limit, minLimit, maxLimit)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Limit is invalid: ' + args.limit);
    }
};

var _execute = function(env, args, next) {
    var dal = env.dal;
    var dUserTypes = domain.userTypes;
    var dErr = domain.errors;

    var offset = args.offset || defaultOffset;
    var limit = args.limit || defaultLimit;

    var fnStack = [
        function(cb) {
            dal.isAppExists(args.appId, function(err, exists) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!exists) {
                    cb(errBuilder(dErr.APP_NOT_FOUND, 'Application with specified ID is not found. #ID: ' + args.appId));
                } else {
                    cb();
                }
            });
        },
        function(cb) {
            dal.getUserMainInfoByToken(args.accessToken, function(err, user) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!user) {
                    cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Specified access token "' + args.accessToken + '" is expired or invalid'));
                } else {
                    cb(null, user);
                }
            });
        },
        function(user, cb) {
            dal.userIsAccociatedWithApp(args.appId, user.type, user.id, function(err, isOk) {
                if (err) {
                    return cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!isOk) {
                    cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this application by given token: ' + args.accessToken));
                } else {
                    cb(null, user);
                }
            });
        },

        function(user, cb) {
            var reqArgs = {
                appId: args.appId,
                userCreatorId: user.type === dUserTypes.SERVICE_USER ? null : user.id,
                offset: offset,
                limit: limit
            };
            dal.getChatsList(reqArgs, function(err, chats) {
                if (err || !chats) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, user, chats);
                }
            });
        },
        function(user, chats, cb) {
            var reqArgs = {
                chatIds: _.map(chats, function(item) {
                    return item.id;
                }),
                userType: user.type,
                userId: user.id
            };
            dal.getNumberOfUnreadMessagesPerChats(reqArgs, function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    for (var i = 0; i < chats.length; i++) {
                        chats[i].numberOfUnreadMessages = result[chats[i].id];
                    }
                    cb(null, user, chats);
                }
            });
        },
        function(user, chats, cb) {
            var ids = _.map(chats, function(item) {
                return item.id;
            });
            dal.getLastMessagePerChats(ids, function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    for (var i = 0; i < chats.length; i++) {
                        chats[i].lastMessage = result[chats[i].id];
                    }
                    cb(null, chats);
                }
            });
        }
    ];

    async.waterfall(
        fnStack,
        function(err, chats) {
            if (err) {
                next(err, null);
            } else {
                next(null, chats);
            }
        }
    );
};


module.exports = function(env, args, next) {
    var argsError = _validateArgsHasErrors(env, args);
    if (argsError) {
        next(argsError, null);
    } else {
        _execute(env, args, next);
    }
};