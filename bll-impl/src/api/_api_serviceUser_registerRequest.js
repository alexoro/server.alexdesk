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


var fnExecute = function (env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                newUserId: null,
                passwordHash: null,
                currentTime: null,
                filteredName: null,
                createdUser: null,
                confirmId: null,
                confirmExpires: null,
                result: null
            };
            cb(null , flow);
        },
        fnValidate,
        fnServiceUserGetCreditionalsByLogin,
        fnServiceUserGenerateUserId,
        fnServiceUserGenerateRegistrationTime,
        fnServiceUserHashPassword,
        fnServiceUserFilterName,
        fnConfirmGenerateId,
        fnConfirmGenerateExpiresTime,
        fnServiceUserCreate,
        fnConfirmCreate,
        fnConfirmSendToServiceUser,
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

    if (flow.args.login === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Login is not defined'));
    }
    if (flow.args.password === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Password is not defined'));
    }
    if (flow.args.name === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Name is not defined'));
    }

    if (!validate.email(flow.args.login)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Service user login must be in email format'));
    }
    if (!validate.serviceUserPassword(flow.args.password)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]'));
    }
    if (!validate.serviceUserName(flow.args.name)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Name must be a string with length [0, 40]'));
    }

    return cb(null, flow);
};

var fnServiceUserGetCreditionalsByLogin = function (flow, cb) {
    var reqArgs = {
        login: flow.args.login
    };
    flow.env.dal.getServiceUserCreditionalsByLogin(reqArgs, function(err, creditionals) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (creditionals === null) {
            cb(null, flow);
        } else if (typeof creditionals !== 'object') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'DAL returned invalid response. Expected - object, received: ' + creditionals));
        } else {
            cb(errBuilder(dErr.USER_ALREADY_EXISTS, 'User with specified login is already exists: ' + flow.args.login));
        }
    });
};

var fnServiceUserGenerateUserId = function (flow, cb) {
    flow.env.uuid.newBigInt(function(err, userId) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.newUserId = userId;
            cb(null, flow);
        }
    });
};

var fnServiceUserGenerateRegistrationTime = function (flow, cb) {
    flow.env.currentTimeProvider.getCurrentTime(function(err, currentTime) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.currentTime = currentTime;
            cb(null, flow);
        }
    });
};

var fnServiceUserHashPassword = function (flow, cb) {
    flow.env.passwordManager.hashServiceUserPassword(flow.args.password, function(err, passwordHash) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.passwordHash = passwordHash;
            cb(null, flow);
        }
    });
};

var fnServiceUserFilterName = function (flow, cb) {
    flow.filteredName = filter.serviceUserName(flow.args.name);
    cb(null, flow);
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

var fnConfirmGenerateExpiresTime = function (flow, cb) {
    flow.env.accessTokenConfig.getExpireTimeForRegister(function (err, expires) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.confirmExpires = expires;
            cb(null, flow);
        }
    });
};

var fnServiceUserCreate = function (flow, cb) {
    var reqArgs = {
        id: flow.newUserId,
        login: flow.args.login,
        passwordHash: flow.passwordHash,
        name: flow.filteredName,
        registered: flow.currentTime,
        lastVisit: flow.currentTime
    };

    flow.env.dal.createServiceUser(reqArgs, function(err) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            delete reqArgs.passwordHash;
            flow.createdUser = reqArgs;
            cb(null, flow);
        }
    });
};

var fnConfirmCreate = function (flow, cb) {
    var reqArgs = {
        id: flow.confirmId,
        expires: flow.confirmExpires,
        userId: flow.newUserId
    };
    flow.env.dal.serviceUserCreateRegisterConfirmData(reqArgs, function (err) {
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
        expires: flow.confirmExpires,
        userId: flow.newUserId
    };
    flow.env.emailSender.sendServiceUserRegistrationConfirmLink(reqArgs, function(err) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.createdUser.isConfirmed = false;
    flow.result = {
        "confirmation": {
            "id": flow.confirmId,
            "expires": flow.confirmExpires
        },
        "user": flow.createdUser
    };
    cb(null, flow);
};


module.exports = fnExecute;