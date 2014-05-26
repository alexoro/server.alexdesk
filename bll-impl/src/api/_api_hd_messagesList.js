/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

var _ = require('underscore');
var async = require('async');

var domain = require('../domain');

var validate = require('./_validation');
var errBuilder = require('./_errorBuilder');


var defaultOffset = -50;
var defaultLimit = 50;


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
    if (args.chatId === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Chat id is not defined');
    }

    if (!validate.accessToken(args.accessToken)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + args.accessToken);
    }
    if (!validate.chatId(args.chatId)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect chat id value: ' + args.chatId);
    }

    if (args.offset !== undefined && !validate.messagesListOffset(args.offset)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Offset is invalid: ' + args.offset);
    }
    if (args.limit !== undefined && !validate.messagesListLimit(args.limit)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Limit is invalid: ' + args.limit);
    }
};

var _execute = function(env, args, next) {
    var dal = env.dal;
    var dErr = domain.errors;

    var offset = args.offset || defaultOffset;
    var limit = args.limit || defaultLimit;

    var fnStack = [
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
        function (user, cb) {
            if (user.type === domain.userTypes.SERVICE_USER) {
                var reqArgs = {
                    userId: user.id
                };
                dal.serviceUserIsConfirmed(reqArgs, function (err, isConfirmed) {
                    if (err) {
                        cb(errBuilder(dErr.INTERNAL_ERROR, err));
                    } else if (!isConfirmed) {
                        cb(errBuilder(dErr.USER_NOT_CONFIRMED, 'User not confirmed'));
                    } else {
                        cb(null, user);
                    }
                });
            } else {
                cb(null, user);
            }
        },
        function(user, cb) {
            dal.isChatExists({chatId: args.chatId}, function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (typeof result !== 'boolean') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of isChatExists() is not a boolean type: ' + result));
                } else if (!result) {
                    cb(errBuilder(dErr.CHAT_NOT_FOUND, 'Chat not found. ID: ' + args.chatId));
                } else {
                    cb(null, user);
                }
            });
        },
        function(user, cb) {
            dal.getAppIdChatBelongsTo({chatId: args.chatId}, function(err, appId) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (typeof appId !== 'string') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of getAppIdChatBelongsTo() is not a string: ' + appId));
                } else if (!validate.appId(appId)) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Application ID for chat is invalid:. ID: ' + appId));
                } else {
                    cb(null, user, appId);
                }
            });
        },
        function(user, appId, cb) {
            dal.userIsAssociatedWithApp(appId, user.type, user.id, function(err, isAssociated) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (typeof isAssociated !== 'boolean') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of userIsAssociatedWithApp() is not a boolean type: ' + isAssociated));
                } else if (!isAssociated) {
                    cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this chat'));
                } else {
                    cb(null, user, appId);
                }
            });
        },
        function(user, appId, cb) {
            if (user.type === domain.userTypes.SERVICE_USER) {
                cb(null, user);
            } else {
                dal.isUserTheCreatorOfChat({chatId: args.chatId, userType: user.type, userId: user.id}, function(err, isCreator) {
                    if (err) {
                        cb(errBuilder(dErr.INTERNAL_ERROR, err));
                    } else if (typeof isCreator !== 'boolean') {
                        cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of isUserTheCreatorOfChat() is not a boolean type: ' + isCreator));
                    } else if (!isCreator) {
                        cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this chat'));
                    } else {
                        cb(null, user);
                    }
                });
            }
        },

        function(user, cb) {
            dal.getLastVisitOfUserToChat({chatId: args.chatId, userType: user.type, userId: user.id}, function(err, lastVisit) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!(lastVisit instanceof Date)) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of getLastVisitOfUserToChat() is not a Date type: ' + lastVisit));
                } else {
                    cb(null, user, lastVisit);
                }
            });
        },
        function(user, lastVisit, cb) {
            var reqArgs = {
                chatId: args.chatId,
                offset: offset,
                limit: limit
            };
            dal.getMessagesList(reqArgs, function(err, messages) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!(messages instanceof Array)) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of getMessagesList() is not a Array type: ' + lastVisit));
                } else {
                    cb(null, user, messages, lastVisit);
                }
            });
        },

        function(user, messages, lastVisit, cb) {
            for (var i = 0; i < messages.length; i++) {
                delete messages[i].appId;
                delete messages[i].chatId;
                messages[i].isRead = messages[i].created.getTime() <= lastVisit.getTime();
            }
            cb(null, user, messages);
        },

        function(user, messages, cb) {
            env.currentTimeProvider.getCurrentTime(function(err, nowDate) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!(nowDate instanceof Date)) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Current time is not a Date type: ' + nowDate));
                } else {
                    cb(null, user, messages, nowDate);
                }
            });
        },
        function(user, messages, nowDate, cb) {
            var reqArgs = {
                chatId: args.chatId,
                userType: user.type,
                userId: user.id,
                newLastVisit: nowDate
            };
            dal.updateLastVisitForChat(reqArgs, function(err) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, messages);
                }
            });
        }
    ];

    async.waterfall(
        fnStack,
        function(err, messages) {
            if (err) {
                next(err, null);
            } else {
                next(null, messages);
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