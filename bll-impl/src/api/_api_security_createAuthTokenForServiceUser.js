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
        fnServiceUserHashPassword,
        fnServiceUserGetIdByCreditionalsAndCheckPassword,
        fnCheckServiceUserIsExistsAndConfirmed,
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
    if (flow.args.login === undefined || flow.args.password === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Not all required fields are set: login or password'));
    }

    if (!validate.email(flow.args.login)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Service user login must be in email format'));
    }
    if (!validate.serviceUserPassword(flow.args.password)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]'));
    }

    return cb(null, flow);
};

var fnServiceUserHashPassword = function (flow, cb) {
    flow.env.passwordManager.hashServiceUserPassword(flow.args.password, function(err, hashedPassword) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.passwordHash = hashedPassword;
            cb(null, flow);
        }
    });
};

var fnServiceUserGetIdByCreditionalsAndCheckPassword = function (flow, cb) {
    var reqArgs = {
        login: flow.args.login
    };
    flow.env.dal.getServiceUserCreditionalsByLogin(reqArgs, function(err, creditionals) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!creditionals) {
            cb(errBuilder(dErr.USER_NOT_FOUND, 'User with specified creditionals is not found'));
        } else if (creditionals.passwordHash !== flow.passwordHash) {
            cb(errBuilder(dErr.INVALID_PASSWORD, 'User was found, but invalid password was specified'));
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
    flow.env.dal.getServiceUserProfileById(reqArgs, function (err, userProfile) {
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
    flow.env.accessTokenConfig.getExpireTimeForServiceUser(function(err, expires) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.tokenExpires = expires;
            cb(null, flow);
        }
    });
};

var fnTokenSave = function (flow, cb) {
    var toSave = {
        token: flow.tokenId,
        userType: domain.userTypes.SERVICE_USER,
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