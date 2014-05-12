/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

var _ = require('underscore');
var async = require('async');

var domain = require('../domain');

var validate = require('./_validation');
var errBuilder = require('./_errorBuilder');

//return {
//    token: accessToken, appId: appId, offset: offset || 0, password: limit || 50
//};

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
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, chats);
                }
            });
        },
        function(chats, cb) {
            var ids = _.map(chats, function(item) {
                return item.id;
            });
            dal.getNumberOfUnreadMessagesPerChats(ids, function(err, result) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    for (var i = 0; i < chats.length; i++) {
                        chats[i].numberOfUnreadMessages = result[chats[i].id];
                    }
                    cb(null, chats);
                }
            });
        },
        function(chats, cb) {
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

    /*
     var matchChat = {
     id: '2',
     appId: '1',
     userCreatorId: '2',
     userCreatorType: domain.userTypes.APP_USER,
     created: new Date('2012-05-01 13:20:00 +00:00'),
     title: '',
     type: domain.chatTypes.UNKNOWN,
     status: domain.chatStatuses.UNKNOWN,
     lastUpdate: new Date('2012-05-01 13:26:00 +00:00'),
     numberOfUnreadMessages: 1,
     extra: {
     countryId: domain.countries.getIdByCode('ru'),
     langId: domain.languages.getIdByCode('ru'),
     api: 10,
     apiTextValue: 'Gingerbird',
     appBuild: 1,
     appVersion: '1.0',
     deviceManufacturer: 'Samsung',
     deviceModel: 'S5',
     deviceWidthPx: 1280,
     deviceHeightPx: 1920,
     deviceDensity: 320,
     isRooted: false,
     metaData: ''
     },
     lastMessage: {
     id: '6',
     userCreatorId: '2',
     userCreatorType: domain.userTypes.APP_USER,
     created: new Date('2012-05-01 13:26:00 +00:00'),
     content: 'Oh! Thanks'
     }
     };
     */

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