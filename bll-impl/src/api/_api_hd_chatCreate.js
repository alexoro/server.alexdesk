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

    if (args.platform === domain.platforms.ANDROID) {
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
    }
};

var _execute = function(env, args, next) {
    var dal = env.dal;
    var dErr = domain.errors;

    var messageOriginal = args.message;
    var metaDataOriginal = args.extra.metaData;

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
                    cb(null, user);
                }
            });
        },
        function(user, cb) {
            if (user.type !== domain.userTypes.APP_USER) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'Only app users can create chats'));
            } else {
                cb(null, user);
            }
        },
        function(user, cb) {
            dal.getAppOwnerUserMainInfoByAppId({appId: args.appId}, function(err, appOwnerUser) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!appOwnerUser) {
                    cb(errBuilder(dErr.LOGIC_ERROR, 'Owner of application is not found. AppId: ' + appOwnerUser));
                } else {
                    cb(null, user, appOwnerUser);
                }
            });
        },

        function(user, appOwnerUser, cb) {
            var flow = {
                user: user,
                appOwnerUser: appOwnerUser,
                currentTime: null,
                newChatId: null,
                newMessageId: null,
                filteredMessage: null,
                filteredMetaData: null,
                countryId: null,
                langId: null
            };
            cb(null, flow);
        },

        function(flow, cb) {
            env.currentTimeProvider.getCurrentTime(function(err, dateNow) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!dateNow || !(dateNow instanceof Date)) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Current date is invalid object: ' + dateNow));
                } else {
                    flow.currentTime = dateNow;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            env.uuid.newBigInt(function(err, id) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!id || typeof id !== 'string') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Generated id for chat is invalid: ' + id));
                } else {
                    flow.newChatId = id;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            env.uuid.newBigInt(function(err, id) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!id || typeof id !== 'string') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Generated id for message is invalid: ' + id));
                } else {
                    flow.newMessageId = id;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            flow.filteredMessage = filter.message(messageOriginal);
            cb(null, flow);
        },
        function(flow, cb) {
            flow.filteredMetaData = filter.metaData(metaDataOriginal);
            cb(null, flow);
        },
        function(flow, cb) {
            flow.countryId = domain.countries.getIdByCode(args.extra.country);
            cb(null, flow);
        },
        function(flow, cb) {
            flow.langId = domain.languages.getIdByCode(args.extra.lang);
            cb(null, flow);
        },

        function(flow, cb) {
            var reqArgs = {};

            reqArgs.newChat = {
                id: flow.newChatId,
                appId: args.appId,
                userCreatorId: flow.user.id,
                userCreatorType: flow.user.type,
                created: flow.currentTime,
                title: '',
                type: domain.chatTypes.UNKNOWN,
                status: domain.chatStatuses.UNKNOWN,
                lastUpdate: flow.currentTime,
                platform: args.platform,
                extra: {
                    countryId: flow.countryId,
                    langId: flow.langId,
                    api: args.extra.api,
                    apiTextValue: args.extra.apiTextValue,
                    appBuild: args.extra.appBuild,
                    appVersion: args.extra.appVersion,
                    deviceManufacturer: args.extra.deviceManufacturer,
                    deviceModel: args.extra.deviceModel,
                    deviceWidthPx: args.extra.deviceWidthPx,
                    deviceHeightPx: args.extra.deviceHeightPx,
                    deviceDensity: args.extra.deviceDensity,
                    isRooted: args.extra.isRooted,
                    metaData: flow.filteredMetaData
                }
            };
            reqArgs.newMessage = {
                id: flow.newMessageId,
                userCreatorId: flow.user.id,
                userCreatorType: flow.user.type,
                created: flow.currentTime,
                content: flow.filteredMessage,
                isRead: true
            };
            reqArgs.participants = [
                {
                    userId: flow.user.id,
                    userType: flow.user.type,
                    lastVisit:flow.currentTime
                },
                {
                    userId: flow.appOwnerUser.id,
                    userType: flow.appOwnerUser.type,
                    lastVisit: new Date('1970-01-01 00:00:00 +00:00')
                }
            ];

            dal.createChatWithMessage(reqArgs, function(err) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    reqArgs.newChat.message = reqArgs.newMessage;
                    cb(null, reqArgs.newChat);
                }
            });
        }
    ];

    async.waterfall(
        fnStack,
        function(err, newChat) {
            if (err) {
                next(err);
            } else {
                next(null, newChat);
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