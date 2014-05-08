/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var _ = require('underscore');
var async = require('async');

var validate = require('./_validation');
var md5 = require('./_md5');


var _validateArgsHasErrors = function(env, args) {
    var bllErr = env.bllInterface.errors;
    var bllErrBuilder = env.bllInterface.errorBuilder;

    if (!args) {
        return bllErrBuilder(bllErr.INVALID_PARAMS, 'Arguments is not defined');
    }
    if (typeof args !== 'object') {
        return bllErrBuilder(bllErr.INVALID_PARAMS, 'Arguments is not a object');
    }
    if (args.login === undefined || args.password === undefined) {
        return bllErrBuilder(bllErr.INVALID_PARAMS, 'Not all required fields are set: login or password');
    }

    if (!validate.email(args.login)) {
        return bllErrBuilder(bllErr.INVALID_PARAMS, 'Service user login must be in email format');
    }
    if (!validate.app_user_password(args.password)) {
        return bllErrBuilder(bllErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]');
    }
};

var _hashPassword = function(password) {
    return md5(password);
};

var _generateExpires = function() {
    return Date.now() + 1000 * 60 * 60 * 24 * 30 * 12;
};

var _create = function(env, args, next) {
    var dal = env.dal;
    var uuid = env.uuid;
    var bllUserTypes = env.bllInterface;
    var bllErr = env.bllInterface.errors;
    var bllErrBuilder = env.bllInterface.errorBuilder;

    var fnStack = [
        function(cb) {
            var creditionals = {
                login: args.login,
                passwordHash: _hashPassword(args.password)
            };
            dal.getServiceUserIdByCreditionals(creditionals, function(err, userId) {
                if (err) {
                    cb(bllErrBuilder(bllErr.INTERNAL_ERROR, err));
                } else if (!userId) {
                    cb(bllErrBuilder(bllErr.USER_NOT_FOUND, 'User with specified creditionals is not found'));
                } else {
                    cb(null, userId);
                }
            });
        },
        function(userId, cb) {
            uuid.newGuid4(function(err, guid) {
                if (err) {
                    cb(bllErrBuilder(bllErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, userId, guid);
                }
            });
        },
        function(userId, guid, cb) {
            var expires = _generateExpires();
            var toSave = {
                token: guid,
                user_type: bllUserTypes.userTypes.SERVICE_USER,
                user_id: userId,
                expires: expires
            };
            dal.createAuthToken(toSave, function(err) {
                if (err) {
                    cb(bllErrBuilder(bllErr.INTERNAL_ERROR, err));
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