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
    if (args.login === undefined || args.password === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Not all required fields are set: login or password');
    }

    if (!validate.email(args.login)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Service user login must be in email format');
    }
    if (!validate.serviceUserPassword(args.password)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]');
    }
};

var _create = function(env, args, next) {
    var dal = env.dal;
    var uuid = env.uuid;
    var dUserTypes = domain.userTypes;
    var dErr = domain.errors;

    var fnStack = [
        function(cb) {
            env.passwordManager.hashServiceUserPassword(args.password, cb);
        },
        function(passwordHash, cb) {
            var creditionals = {
                login: args.login,
                passwordHash: passwordHash
            };
            dal.getServiceUserIdByCreditionals(creditionals, function(err, userId) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!userId) {
                    cb(errBuilder(dErr.USER_NOT_FOUND, 'User with specified creditionals is not found'));
                } else {
                    cb(null, userId);
                }
            });
        },
        function (userId, cb) {
            var reqArgs = {
                userId: userId
            };
            dal.serviceUserIsConfirmed(reqArgs, function (err, isConfirmed) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!isConfirmed) {
                    cb(errBuilder(dErr.USER_NOT_CONFIRMED, 'User not confirmed'));
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
            env.accessTokenConfig.getExpireTimeForServiceUser(function(err, expires) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, userId, guid, expires);
                }
            });
        },
        function(userId, guid, expires, cb) {
            var toSave = {
                token: guid,
                userType: dUserTypes.SERVICE_USER,
                userId: userId,
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