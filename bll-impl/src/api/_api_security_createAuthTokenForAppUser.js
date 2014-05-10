/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var _ = require('underscore');
var async = require('async');

var domain = require('../domain');

var errBuilder = require('./_errorBuilder');
var validate = require('./_validation');


var _validateArgsHasErrors = function(env, args) {
    var dErr = domain.errors;

    if (!args) {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not defined');
    }
    if (typeof args !== 'object') {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object');
    }
    if (args.appId === undefined || args.login === undefined || args.password === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Not all required fields are set: appId or login or password');
    }

    if (!validate.appId(args.appId)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Invalid application id value: ' + args.appId);
    }
    if (!validate.appUserLogin(args.login)) {
        return errBuilder(dErr.INVALID_PARAMS, 'App user login must be a string with length [1,64]. Given: ' + args.login);
    }
    if (!validate.appUserPassword(args.password)) {
        return errBuilder(dErr.INVALID_PARAMS, 'App user password must be a string with length [1, 64]. Given: ' + args.password);
    }
};

var _create = function(env, args, next) {
    var dal = env.dal;
    var uuid = env.uuid;
    var dUserTypes = domain.userTypes;
    var dErr = domain.errors;

    var fnStack = [
        function(cb) {
            env.dal.isAppExists(args.appId, function(err, result) {
                if (!result) {
                    return cb(errBuilder(dErr.APP_NOT_FOUND, 'Application not found. #ID: ' + args.appId));
                }
                return cb();
            });
        },
        function(cb) {
            env.passwordManager.hashAppUserPassword(args.password, cb);
        },
        function(passwordHash, cb) {
            var creditionals = {
                app_id: args.appId,
                login: args.login,
                passwordHash: passwordHash
            };
            dal.getAppUserIdByCreditionals(creditionals, function(err, userId) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!userId) {
                    cb(errBuilder(dErr.USER_NOT_FOUND, 'User with specified creditionals is not found'));
                } else {
                    cb(null, userId);
                }
            });
        },
        function(userId, cb) {
            uuid.newGuid4(function(err, guid) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, userId, guid);
                }
            });
        },
        function(userId, guid, cb) {
            env.accessTokenConfig.getExpireTimeForAppUser(function(err, expires) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, userId, guid, expires);
                }
            });
        },
        function(userId, guid, expires, cb) {
            var toSave = {
                token: guid,
                user_type: dUserTypes.APP_USER,
                user_id: userId,
                expires: expires
            };
            dal.createAuthToken(toSave, function(err) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, guid, expires);
                }
            });
        }
    ];

    async.waterfall(
        fnStack,
        function(err, guid, expires) {
            if (err) {
                return next(err);
            } else {
                next(null, {token: guid, expires: expires});
            }
        }
    );
};


module.exports = function(env, args, next) {
    var argsError = _validateArgsHasErrors(env, args);
    if (argsError) {
        next(argsError, null);
    } else {
        _create(env, args, next);
    }
};