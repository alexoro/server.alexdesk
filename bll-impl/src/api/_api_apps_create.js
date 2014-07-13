/**
 * Created by UAS on 23.05.2014.
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
                currentDate: null,
                userType: null,
                userId: null,
                newAppId: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnCheckThatOnlyAndroidApplicationCanBeCreated,
        fnGetCurrentDate,
        fnUserGetInfoByToken,
        fnCheckThatServiceUserIsCallingThisMethod,
        fnCheckServiceUserIsExistsAndConfirmed,
        fnAppGenerateId,
        fnAppCreateAndGenerateResult
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
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Arguments are not defined'));
    }
    if (typeof flow.args !== 'object') {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object'));
    }

    if (flow.args.accessToken === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Access token is not defined'));
    }
    if (flow.args.platform === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Platform is not defined'));
    }
    if (flow.args.title === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Title is not defined'));
    }
    if (flow.args.extra === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Extra is not defined'));
    }

    if (!validate.accessToken(flow.args.accessToken)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + flow.args.accessToken));
    }
    if (!validate.platform(flow.args.platform)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect platform value: ' + flow.args.platform));
    }
    if (!validate.appTitle(flow.args.title)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect title value: ' + flow.args.title));
    }
    if (!validate.extra(flow.args.extra)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra value: ' + flow.args.extra));
    }

    if (flow.args.platform === domain.platforms.ANDROID) {
        if (flow.args.extra.package === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Package is not defined'));
        }
        if (!validate.appAndroidPackage(flow.args.extra.package)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect package value: ' + flow.args.extra.package));
        }
    }

    return cb(null, flow);
};

var fnCheckThatOnlyAndroidApplicationCanBeCreated = function (flow, cb) {
    if (flow.args.platform !== domain.platforms.ANDROID) {
        cb(errBuilder(dErr.LOGIC_ERROR, 'Only Android applications are allowed to be created'));
    } else {
        cb(null, flow);
    }
};

var fnGetCurrentDate = function (flow, cb) {
    flow.env.configProvider.getCurrentDateUtc(function(err, dateNow) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!dateNow || !(dateNow instanceof Date)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Current date is invalid object: ' + dateNow));
        } else {
            flow.currentDate = dateNow;
            cb(null, flow);
        }
    });
};

var fnUserGetInfoByToken = function (flow, cb) {
    var reqArgs = {
        token: flow.args.accessToken
    };
    flow.env.dal.authTokenGetUserInfoByToken(reqArgs, function(err, user) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!user || flow.currentDate.getTime() >= user.expires.getTime()) {
            cb(errBuilder(dErr.INVALID_OR_EXPIRED_TOKEN, 'Specified access token "' + flow.args.accessToken + '" is expired or invalid'));
        } else {
            flow.userType = user.type;
            flow.userId = user.id;
            cb(null, flow);
        }
    });
};

var fnCheckThatServiceUserIsCallingThisMethod = function (flow, cb) {
    if (flow.userType !== domain.userTypes.SERVICE_USER) {
        cb(errBuilder(dErr.ACCESS_DENIED, 'Only service user has access to this command'));
    } else {
        cb(null, flow);
    }
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

var fnAppGenerateId = function (flow, cb) {
    flow.env.uuid.newBigInt(function(err, id) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!id || typeof id !== 'string') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Generated id for chat is invalid: ' + id));
        } else {
            flow.newAppId = id;
            cb(null, flow);
        }
    });
};

var fnAppCreateAndGenerateResult = function (flow, cb) {
    var reqArgs = {
        id: flow.newAppId,
        platform: flow.args.platform,
        title: flow.args.title,
        created: flow.currentDate,
        isApproved: true,
        isBlocked: false,
        isDeleted: false,
        extra: {
            package: flow.args.package
        },
        ownerUserId: flow.userId
    };

    flow.env.dal.apps_create(reqArgs, function(err) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.result = reqArgs;
            cb(null, flow);
        }
    });
};


module.exports = fnExecute;