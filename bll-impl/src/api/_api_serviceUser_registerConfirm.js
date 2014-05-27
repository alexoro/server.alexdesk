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

    if (!validate.guid(args.confirmToken)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Confirm token is invalid');
    }
};

var _create = function(env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                confirmData: null,
                currentTime: null
            };
            cb(null , flow);
        },

        function(flow, cb) {
            var reqArgs = {
                confirmToken: flow.args.confirmToken
            };
            flow.env.dal.fetchUserCreateRegisterConfirmData(reqArgs, function(err, confirmData) {
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
        function(flow, cb) {
            flow.env.dal.serviceUserIsConfirmed({userId: flow.confirmData.userId}, function (err, isConfirmed) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (isConfirmed) {
                    cb(errBuilder(dErr.USER_ALREADY_CONFIRMED, 'User was already confirmed'));
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

        function(flow, cb) {
            flow.env.dal.markServiceUserAsConfirmed({userId: flow.confirmData.userId}, function(err) {
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
        function(err) {
            if (err) {
                next(err);
            } else {
                next(null);
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