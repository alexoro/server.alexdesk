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

    if (args.login === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Login is not defined');
    }
    if (!validate.email(args.login)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Service user login must be in email format');
    }
};

var _create = function(env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                userId: null,
                confirmId: null,
                confirmExpires: null
            };
            cb(null , flow);
        },

        function (flow, cb) {
            flow.env.dal.getServiceUserCreditionalsByLogin({login: flow.args.login}, function (err, creditionals) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (!creditionals) {
                    cb(errBuilder(dErr.USER_NOT_FOUND, 'User with specified login is not found'));
                } else {
                    flow.userId = creditionals.id;
                    cb(null, flow);
                }
            });
        },
        function (flow, cb) {
            flow.env.dal.serviceUserIsConfirmed({userId: flow.userId}, function (err, isConfirmed) {
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
            flow.env.uuid.newGuid4(function(err, id) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.confirmId = id;
                    cb(null, flow);
                }
            });
        },
        function (flow, cb) {
            flow.env.accessTokenConfig.getExpireTimeForPasswordReset(function (err, expires) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.confirmExpires = expires;
                    cb(null, flow);
                }
            });
        },

        function (flow, cb) {
            var reqArgs = {
                id: flow.confirmId,
                userId: flow.userId,
                expires: flow.confirmExpires
            };
            flow.env.dal.serviceUserCreateResetPasswordConfirmData(reqArgs, function (err) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    cb(null, flow);
                }
            });
        },
        function (flow, cb) {
            var reqArgs = {
                id: flow.confirmId,
                expires: flow.confirmExpires
            };
            flow.env.emailSender.sendServiceUserResetPasswordConfirmLink(reqArgs, function(err) {
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
                var r = {
                    id: flow.confirmId,
                    expires: flow.confirmExpires
                };
                next(null, r);
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