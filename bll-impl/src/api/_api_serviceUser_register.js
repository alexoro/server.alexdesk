/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var _ = require('underscore');
var async = require('async');

var domain = require('../domain');

var errBuilder = require('./_errorBuilder');
var validate = require('./_validation');
var filter = require('./_filter');


var _validateArgsHasErrors = function(env, args) {
    var dErr = domain.errors;

    if (!args) {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not defined');
    }
    if (typeof args !== 'object') {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object');
    }

    if (args.login === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Login is not defined');
    }
    if (args.password === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password is not defined');
    }
    if (args.name === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Name is not defined');
    }

    if (!validate.email(args.login)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Service user login must be in email format');
    }
    if (!validate.serviceUserPassword(args.password)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]');
    }
    if (!validate.serviceUserName(args.name)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Name must be a string with length [0, 40]');
    }
};

var _create = function(env, args, next) {
    var dal = env.dal;
    var uuid = env.uuid;
    var dErr = domain.errors;

    var fnStack = [
        function(cb) {
            var flow = {
                newUserId: null,
                passwordHash: null,
                currentTime: null,
                filteredName: null
            };
            cb(null , flow);
        },
        function(flow, cb) {
            env.passwordManager.hashServiceUserPassword(args.password, function(err, passwordHash) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.passwordHash = passwordHash;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            dal.getServiceUserCreditionalsByLogin({login: args.login}, function(err, creditionals) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (creditionals === null) {
                    cb(null, flow);
                } else if (typeof creditionals !== 'object') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'DAL returned invalid response. Expected - object, received: ' + creditionals));
                } else {
                    cb(errBuilder(dErr.USER_ALREADY_EXISTS, 'User with specified login is already exists: ' + args.login));
                }
            });
        },
        function(flow, cb) {
            uuid.newBigInt(function(err, userId) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.newUserId = userId;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            env.currentTimeProvider.getCurrentTime(function(err, currentTime) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.currentTime = currentTime;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            flow.filteredName = filter.serviceUserName(args.name);
            cb(null, flow);
        },
        function(flow, cb) {
            var reqArgs = {
                id: flow.newUserId,
                login: args.login,
                passwordHash: flow.passwordHash,
                name: flow.filteredName,
                registered: flow.currentTime,
                lastVisit: flow.currentTime
            };

            dal.createServiceUser(reqArgs, function(err) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    delete reqArgs.passwordHash;
                    cb(null, reqArgs);
                }
            });
        }
    ];

    async.waterfall(
        fnStack,
        function(err, newUser) {
            if (err) {
                next(err);
            } else {
                next(null, newUser);
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