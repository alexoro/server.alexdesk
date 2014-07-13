/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var async = require('async');

var domain = require('../domain');
var dErr = domain.errors;

var errBuilder = require('./_errorBuilder');
var validate = require('./_validation');


var fnExecute = function (env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                confirmData: null,
                login: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnServiceUserGetResetPasswordConfirmData,
        fnServiceUserIsExistsAndConfirmed,
        fnGetCurrentTIme,
        fnConfirmIsNotExpired,
        fnGenerateResult
    ];

    async.waterfall(
        fnStack,
        function(err, flow) {
            if (err) {
                next(err);
            } else {
                next(null, flow.result);
            }
        }
    );
};


var fnValidate = function (flow, cb) {
    if (!flow.args) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Arguments is not defined'));
    }
    if (typeof flow.args !== 'object') {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object'));
    }

    if (flow.args.confirmToken === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Confirm token is not defined'));
    }
    if (!validate.guid(flow.args.confirmToken)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Confirm token is invalid'));
    }

    return cb(null, flow);
};

var fnServiceUserGetResetPasswordConfirmData = function (flow, cb) {
    var reqArgs = {
        token: flow.args.confirmToken
    };
    flow.env.dal.serviceUsers_resetPasswordConfirmDataGet(reqArgs, function(err, confirmData) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!confirmData) {
            cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Specified token is not found'));
        } else {
            flow.confirmData = confirmData;
            cb(null, flow);
        }
    });
};

var fnServiceUserIsExistsAndConfirmed = function (flow, cb) {
    var reqArgs = {
        id: flow.confirmData.userId
    };
    flow.env.dal.serviceUsers_getProfileById(reqArgs, function (err, userProfile) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!userProfile) {
            cb(errBuilder(dErr.USER_NOT_FOUND, 'User is not exists'));
        } else if (!userProfile.isConfirmed) {
            cb(errBuilder(dErr.USER_NOT_CONFIRMED, 'User is not confirmed'));
        } else {
            flow.login = userProfile.login;
            cb(null, flow);
        }
    });
};

var fnGetCurrentTIme = function (flow, cb) {
    flow.env.configProvider.getCurrentDateUtc(function (err, currentTime) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!(currentTime instanceof Date)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Current time returned not a Date'));
        } else {
            flow.currentTime = currentTime;
            cb(null, flow);
        }
    });
};

var fnConfirmIsNotExpired = function (flow, cb) {
    if (!(flow.confirmData.expires instanceof Date)) {
        cb(errBuilder(dErr.INTERNAL_ERROR, 'Token expires is not a Date object'));
    } else if (flow.currentTime.getTime() >= flow.confirmData.expires.getTime()) {
        cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Token is expired'));
    } else {
        cb(null, flow);
    }
};

var fnGenerateResult = function (flow, cb) {
    flow.result = {
        login: flow.login
    };
    cb(null, flow);
};


module.exports = fnExecute;