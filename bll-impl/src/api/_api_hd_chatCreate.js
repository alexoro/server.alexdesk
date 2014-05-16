/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

var _ = require('underscore');
var async = require('async');

var domain = require('../domain');

var validate = require('./_validation');
var filter = require('./_filter');
var errBuilder = require('./_errorBuilder');



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
    if (args.message === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Message is not defined');
    }

    if (!validate.accessToken(args.accessToken)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + args.accessToken);
    }
    if (!validate.chatId(args.chatId)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect chat id value: ' + args.chatId);
    }
    if (!validate.message(args.message)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect message value: ' + args.message);
    }
};

var _execute = function(env, args, next) {
    var dal = env.dal;
    var dErr = domain.errors;

    var accessToken = args.accessToken;
    var chatId = args.chatId;
    var messageOriginal = args.message;

    var fnStack = [
        /*function(cb) {
            dal.getUserMainInfoByToken(accessToken, function(err, user) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!user) {
                    cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Specified access token "' + accessToken + '" is expired or invalid'));
                } else {
                    cb(null, user);
                }
            });
        },
        function(user, cb) {
            dal.isChatExists({chatId: chatId}, function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (typeof result !== 'boolean') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of isChatExists() is not a boolean type: ' + result));
                } else if (!result) {
                    cb(errBuilder(dErr.CHAT_NOT_FOUND, 'Chat not found. ID: ' + chatId));
                } else {
                    cb(null, user);
                }
            });
        },
        function(user, cb) {
            dal.getAppIdChatBelongsTo({chatId: chatId}, function(err, appId) {
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
                cb(null, user, appId);
            } else {
                dal.isUserTheCreatorOfChat({chatId: chatId, userType: user.type, userId: user.id}, function(err, isCreator) {
                    if (err) {
                        cb(errBuilder(dErr.INTERNAL_ERROR, err));
                    } else if (typeof isCreator !== 'boolean') {
                        cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of isUserTheCreatorOfChat() is not a boolean type: ' + isCreator));
                    } else if (!isCreator) {
                        cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this chat'));
                    } else {
                        cb(null, user, appId);
                    }
                });
            }
        },

        function(user, appId, cb) {
            env.uuid.newBigInt(function(err, messageId) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!messageId || typeof messageId !== 'string') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Generated id for message is invalid: ' + messageId));
                } else {
                    cb(null, user, appId, messageId);
                }
            });
        },

        function(user, appId, messageId, cb) {
            env.currentTimeProvider.getCurrentTime(function(err, dateNow) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!dateNow || !(dateNow instanceof Date)) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Current date is invalid object: ' + dateNow));
                } else {
                    cb(null, user, appId, messageId, dateNow);
                }
            });
        },


        function(user, appId, messageId, dateNow, cb) {
            var newMessage = {
                id: messageId,
                appId: appId,
                chatId: chatId,
                userCreatorId: user.id,
                userCreatorType: user.type,
                created: dateNow,
                content: filter.message(messageOriginal)
            };
            var reqArgs = {newMessage: newMessage};

            dal.createMessageInChatAndUpdateLastVisit(reqArgs, function(err) {
                if (err) {
                    cb(err);
                } else {
                    delete newMessage.appId;
                    delete newMessage.chatId;
                    newMessage.isRead = true;
                    cb(null, newMessage);
                }
            });
        }*/
    ];

    async.waterfall(
        fnStack,
        function(err, newChat) {
            if (err) {
                next(err, null);
            } else {
                next(null, null);
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