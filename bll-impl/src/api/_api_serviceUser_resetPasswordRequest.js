/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var async = require('async');

var domain = require('../domain');
var dErr = domain.errors;

var errBuilder = require('./_errorBuilder');
var validate = require('./_validation');


var fnExecute = function(env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                userId: null,
                confirmId: null,
                confirmExpiresDate: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnServiceUserInfoGetByLogin,
        fnCheckServiceUserIsExistsAndConfirmed,
        fnConfirmGenerateId,
        fnConfirmGenerateExpireTime,
        fnConfirmCreate,
        fnConfirmSendToServiceUser,
        fnGenerateResponse
    ];

    async.waterfall(
        fnStack,
        function(err, result) {
            if (err) {
                next(err);
            } else {
                next(null, result);
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

    if (flow.args.login === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Login is not defined'));
    }
    if (!validate.email(flow.args.login)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Service user login must be in email format'));
    }

    return cb(null, flow);
};

var fnServiceUserInfoGetByLogin = function (flow, cb) {
    flow.env.dal.serviceUserGetCredentialsByLogin({login: flow.args.login}, function (err, creditionals) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!creditionals) {
            cb(errBuilder(dErr.USER_NOT_FOUND, 'User with specified login is not found'));
        } else {
            flow.userId = creditionals.id;
            cb(null, flow);
        }
    });
};

var fnCheckServiceUserIsExistsAndConfirmed = function (flow, cb) {
    var reqArgs = {
        id: flow.userId
    };
    flow.env.dal.serviceUserGetProfileById(reqArgs, function (err, userProfile) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!userProfile) {
            cb(errBuilder(dErr.USER_NOT_FOUND, 'User not found'));
        } else if (!userProfile.isConfirmed) {
            cb(errBuilder(dErr.USER_NOT_CONFIRMED, 'User not confirmed'));
        } else {
            cb(null, flow);
        }
    });
};

var fnConfirmGenerateId = function (flow, cb) {
    flow.env.uuid.newGuid4(function(err, id) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.confirmId = id;
            cb(null, flow);
        }
    });
};

var fnConfirmGenerateExpireTime = function (flow, cb) {
    flow.env.securityManager.getExpireTimeForPasswordReset(function (err, expires) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.confirmExpiresDate = expires;
            cb(null, flow);
        }
    });
};

var fnConfirmCreate = function (flow, cb) {
    var reqArgs = {
        token: flow.confirmId,
        userId: flow.userId,
        expires: flow.confirmExpiresDate
    };
    flow.env.dal.serviceUserCreateResetPasswordConfirmData(reqArgs, function (err) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            cb(null, flow);
        }
    });
};

var fnConfirmSendToServiceUser = function (flow, cb) {
    var reqArgs = {
        id: flow.confirmId,
        expires: flow.confirmExpiresDate
    };
    flow.env.notificationsManager.sendServiceUserResetPasswordConfirmLink(reqArgs, function(err) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            cb(null, flow);
        }
    });
};

var fnGenerateResponse = function (flow, cb) {
    var r = {
        id: flow.confirmId,
        expires: flow.confirmExpiresDate
    };
    cb(null, r);
};


module.exports = fnExecute;