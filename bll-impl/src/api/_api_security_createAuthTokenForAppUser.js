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
                passwordHash: null,
                userId: null,
                tokenId: null,
                tokenExpires: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnAppIsExists,
        fnAppUserHashPassword,
        fnAppUserGetIdByCreditionals,
        fnTokenGenerateId,
        fnTokenGenerateExpireTime,
        fnTokenSave,
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
    if (flow.args.appId === undefined || flow.args.login === undefined || flow.args.password === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Not all required fields are set: appId or login or password'));
    }

    if (!validate.appId(flow.args.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Invalid application id value: ' + flow.args.appId));
    }
    if (!validate.appUserLogin(flow.args.login)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'App user login must be a string with length [1,64]. Given: ' + flow.args.login));
    }
    if (!validate.appUserPassword(flow.args.password)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'App user password must be a string with length [1, 64]. Given: ' + flow.args.password));
    }

    return cb(null, flow);
};

var fnAppIsExists = function (flow, cb) {
    flow.env.dal.isAppExists(flow.args.appId, function(err, result) {
        if (!result) {
            cb(errBuilder(dErr.APP_NOT_FOUND, 'Application not found. #ID: ' + flow.args.appId));
        } else {
            cb(null, flow);
        }
    });
};

var fnAppUserHashPassword = function (flow, cb) {
    flow.env.passwordManager.hashAppUserPassword(flow.args.password, function (err, hashedPassword) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.passwordHash = hashedPassword;
            cb(null, flow);
        }
    });
};

var fnAppUserGetIdByCreditionals = function (flow, cb) {
    var reqArgs = {
        appId: flow.args.appId,
        login: flow.args.login,
        passwordHash: flow.passwordHash
    };
    flow.env.dal.getAppUserIdByCreditionals(reqArgs, function (err, userId) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!userId) {
            cb(errBuilder(dErr.USER_NOT_FOUND, 'User with specified creditionals is not found'));
        } else {
            flow.userId = userId;
            cb(null, flow);
        }
    });
};

var fnTokenGenerateId = function (flow, cb) {
    flow.env.uuid.newGuid4(function(err, guid) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.tokenId = guid;
            cb(null, flow);
        }
    });
};

var fnTokenGenerateExpireTime = function (flow, cb) {
    flow.env.accessTokenConfig.getExpireTimeForAppUser(function(err, expires) {
        if (err) {
            cb(err);
        } else {
            flow.tokenExpires = expires;
            cb(null, flow);
        }
    });
};

var fnTokenSave = function (flow, cb) {
    var toSave = {
        token: flow.tokenId,
        userType: domain.userTypes.APP_USER,
        userId: flow.userId,
        expires: flow.tokenExpires
    };
    flow.env.dal.createAuthToken(toSave, function(err) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.result = {
        token: flow.tokenId,
        expires: flow.tokenExpires
    };
    cb(null, flow);
};


module.exports = fnExecute;