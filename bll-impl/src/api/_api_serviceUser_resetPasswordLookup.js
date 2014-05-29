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
            cb(null , flow);
        },
        fnValidate,
        fnServiceUserGetResetPasswordConfirmData,
        fnServiceUserIsExists,
        fnServiceUserIsConfirmed,
        fnGetCurrentTIme,
        fnConfirmIsNotExpired,
        fnServiceUserGetLoginByUserId,
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
};

var fnServiceUserIsExists = function (flow, cb) {
    var reqArgs = {
        userId: flow.confirmData.userId
    };
    flow.env.dal.serviceUserIsExists(reqArgs, function (err, isExists) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!isExists) {
            cb(errBuilder(dErr.USER_NOT_FOUND, 'User is not exists'));
        } else {
            cb(null, flow);
        }
    });
};

var fnServiceUserIsConfirmed = function (flow, cb) {
    var reqArgs = {userId: flow.confirmData.userId};
    flow.env.dal.serviceUserIsConfirmed(reqArgs, function (err, isConfirmed) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!isConfirmed) {
            cb(errBuilder(dErr.USER_NOT_CONFIRMED, 'User is not confirmed'));
        } else {
            cb(null, flow);
        }
    });
};

var fnGetCurrentTIme = function (flow, cb) {
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
};

var fnConfirmIsNotExpired = function (flow, cb) {
    if (flow.currentTime.getTime() >= flow.confirmData.expires) {
        cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Token is expired'));
    } else {
        cb(null, flow);
    }
};

var fnServiceUserGetLoginByUserId = function (flow, cb) {
    flow.env.dal.getUserLoginById({userId: flow.confirmData.userId}, function (err, login) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.login = login;
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.result = {
        login: flow.login
    };
    cb(null, flow);
};


module.exports = fnExecute;