/**
 * Created by UAS on 23.05.2014.
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
    if (args.platform === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Platform is not defined');
    }
    if (args.title === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Title is not defined');
    }
    if (args.extra === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Extra is not defined');
    }

    if (!validate.accessToken(args.accessToken)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + args.accessToken);
    }
    if (!validate.platform(args.platform)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect platform value: ' + args.platform);
    }
    if (!validate.appTitle(args.title)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect title value: ' + args.title);
    }
    if (!validate.extra(args.extra)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra value: ' + args.extra);
    }

    if (args.platform === domain.platforms.ANDROID) {
        if (args.extra.package === undefined) {
            return errBuilder(dErr.INVALID_PARAMS, 'Package is not defined');
        }
        if (!validate.appAndroidPackage(args.extra.package)) {
            return errBuilder(dErr.INVALID_PARAMS, 'Incorrect package value: ' + args.extra.package);
        }
    }
};

var _execute = function(env, args, next) {
    var dal = env.dal;
    var dErr = domain.errors;

    var fnStack = [
        function(cb) {
            if (args.platform !== domain.platforms.ANDROID) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'Only Android applications are allowed to be created'));
            } else {
                cb(null);
            }
        },

        function(cb) {
            var flow = {
                userType: null,
                userId: null,
                newAppId: null,
                currentTime: null
            };
            cb(null, flow);
        },

        function(flow, cb) {
            dal.getUserMainInfoByToken(args.accessToken, function(err, user) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!user) {
                    cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Specified access token "' + args.accessToken + '" is expired or invalid'));
                } else {
                    flow.userType = user.type;
                    flow.userId = user.id;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            if (flow.userType !== domain.userTypes.SERVICE_USER) {
                cb(errBuilder(dErr.ACCESS_DENIED, 'Only service users has permission to create applications'));
            } else {
                cb(null, flow);
            }
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
                    flow.newAppId = id;
                    cb(null, flow);
                }
            });
        },

        function(flow, cb) {
            var reqArgs = {
                id: flow.newAppId,
                platform: args.platform,
                title: args.title,
                created: flow.currentTime,
                isApproved: true,
                isBlocked: false,
                isDeleted: false,
                extra: {
                    package: args.package
                },
                ownerUserId: flow.userId
            };

            dal.createApplication(reqArgs, function(err) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, reqArgs);
                }
            });
        }
    ];

    async.waterfall(
        fnStack,
        function(err, newApp) {
            if (err) {
                next(err);
            } else {
                next(null, newApp);
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