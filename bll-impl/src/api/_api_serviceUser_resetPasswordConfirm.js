/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var _ = require('underscore');
var async = require('async');

var domain = require('../domain');
var dErr = domain.errors;

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

    if (args.confirmToken === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Confirm token is not defined');
    }
    if (args.newPassword === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password is not defined');
    }

    if (!validate.guid(args.confirmToken)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Confirm token is invalid');
    }
    if (!validate.serviceUserPassword(args.newPassword)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]');
    }
};

var _create = function(env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                confirmData: null,
                hashedPassword: null
            };
            cb(null , flow);
        },

        function(flow, cb) {
            var reqArgs = {
                confirmToken: flow.args.confirmToken
            };
            flow.env.dal.fetchUserResetPasswordConfirmData(reqArgs, function(err, confirmData) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!confirmData) {
                    cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Specified token is not found'));
                } else {
                    flow.confirmData = confirmData;
                    cb(null, flow);
                }
            });
        },
        function (flow, cb) {
            flow.env.dal.serviceUserIsExists({userId: flow.confirmData.userId}, function (err, isExists) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!isExists) {
                    cb(errBuilder(dErr.USER_NOT_FOUND, 'User is not exists'));
                } else {
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            flow.env.dal.serviceUserIsConfirmed({userId: flow.confirmData.userId}, function (err, isConfirmed) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!isConfirmed) {
                    cb(errBuilder(dErr.USER_NOT_CONFIRMED, 'User is not confirmed'));
                } else {
                    cb(null, flow);
                }
            });
        },

        function(flow, cb) {
            flow.env.currentTimeProvider.getCurrentTime(function (err, currentTime) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!(currentTime instanceof Date)) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Current time returned not a Date'));
                } else {
                    flow.currentTime = currentTime;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            if (flow.currentTime.getTime() >= flow.confirmData.expires) {
                cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Token is expired'));
            } else {
                cb(null, flow);
            }
        },

        function (flow, cb) {
            flow.env.passwordManager.hashServiceUserPassword(flow.args.newPassword, function (err, hashedPassword) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (typeof hashedPassword !== 'string') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'Hashed password is not a string'));
                } else {
                    flow.hashedPassword = hashedPassword;
                    cb(null, flow);
                }
            });
        },

        function (flow, cb) {
            var reqArgs = {
                userId: flow.confirmData.userId,
                passwordHash: flow.hashedPassword
            };
            flow.env.dal.updateServiceUserPasswordHash(reqArgs, function (err) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, flow);
                }
            });
        }
    ];

    async.waterfall(
        fnStack,
        function(err, flow) {
            if (err) {
                next(err);
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
        _create(env, args, next);
    }
};