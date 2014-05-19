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


    // validate input

    if (!args) {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments are not defined');
    }
    if (typeof args !== 'object') {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object');
    }


    // validate main

    if (args.accessToken === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Access token is not defined');
    }
    if (args.appId === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'App id is not defined');
    }
    if (args.message === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Message is not defined');
    }
    if (args.platform === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Platform is not defined');
    }
    if (args.extra === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Extra is not defined');
    }

    if (!validate.accessToken(args.accessToken)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + args.accessToken);
    }
    if (!validate.appId(args.appId)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect app id value: ' + args.appId);
    }
    if (!validate.message(args.message)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect message value: ' + args.message);
    }
    if (!validate.platform(args.platform)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect message value: ' + args.message);
    }
    if (!validate.extra(args.extra)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect message value: ' + args.message);
    }


    // validate extra

    if (args.platform !== domain.platforms.ANDROID) {
        return errBuilder(dErr.LOGIC_ERROR, 'Only Android users can create chats');
    }

    if (args.extra.country === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Country is not defined');
    }
    if (args.extra.lang === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Language is not defined');
    }
    if (args.extra.api === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'API is not defined');
    }
    if (args.extra.apiTextValue === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Api Text Value is not defined');
    }
    if (args.extra.appBuild === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'App Build is not defined');
    }
    if (args.extra.appVersion === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'App Version is not defined');
    }
    if (args.extra.deviceManufacturer === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Device Manufacturer is not defined');
    }
    if (args.extra.deviceModel === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Device Model is not defined');
    }
    if (args.extra.deviceWidthPx === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'DeviceWidthPx is not defined');
    }
    if (args.extra.deviceHeightPx === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'DeviceHeightPx is not defined');
    }
    if (args.extra.deviceDensity === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'DeviceDensity is not defined');
    }
    if (args.extra.isRooted === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'IsRooted is not defined');
    }
    if (args.extra.metaData === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'MetaData is not defined');
    }

    if (!validate.countryCode2(args.extra.country)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect country value: ' + args.extra.country);
    }
    if (!validate.langCode2(args.extra.lang)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect language value: ' + args.extra.lang);
    }
    if (!validate.apiAndroid(args.extra.api)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect api value: ' + args.extra.api);
    }
    if (!validate.apiAndroidTextValue(args.extra.apiTextValue)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect api text value: ' + args.extra.apiTextValue);
    }
    if (!validate.appBuild(args.extra.appBuild)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect app build value: ' + args.extra.appBuild);
    }
    if (!validate.appVersion(args.extra.appVersion)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect app version value: ' + args.extra.appVersion);
    }
    if (!validate.deviceManufacturer(args.extra.deviceManufacturer)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect device manufacturer value: ' + args.extra.deviceManufacturer);
    }
    if (!validate.deviceModel(args.extra.deviceModel)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect device model value: ' + args.extra.deviceModel);
    }
    if (!validate.deviceWidthPx(args.extra.deviceWidthPx)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect device width px value: ' + args.extra.deviceWidthPx);
    }
    if (!validate.deviceHeightPx(args.extra.deviceHeightPx)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect device height px value: ' + args.extra.deviceHeightPx);
    }
    if (!validate.deviceDensity(args.extra.deviceDensity)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect device density value: ' + args.extra.deviceDensity);
    }
    if (!validate.isRooted(args.extra.isRooted)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect is rooted value: ' + args.extra.isRooted);
    }
    if (!validate.metaData(args.extra.metaData)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect meta data value: ' + args.extra.metaData);
    }
};

var _execute = function(env, args, next) {
    var dal = env.dal;
    var dErr = domain.errors;

    var messageOriginal = args.message;

    var fnStack = [
        function(cb) {
            dal.isAppExists(args.appId, function(err, exists) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (typeof exists !== 'boolean') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'isAppExists returned invalid response. Boolean is expected, result is: ' + exists));
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
            dal.userIsAssociatedWithApp(args.appId, user.type, user.id, function(err, isAssociated) {
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
        }/*,

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