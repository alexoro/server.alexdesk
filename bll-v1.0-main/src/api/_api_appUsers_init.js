/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var async = require('async');

var domain = require('../domain');
var dErr = domain.errors;

var errBuilder = require('./_errorBuilder');
var validate = require('./_validation');

var MODE_CREATE = 1;
var MODE_UPDATE = 2;


var fnExecute = function (env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                mode: null,
                userId: null,
                passwordHash: null,
                currentTime: null,
                currentProfile: null,
                newUserProfile: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnCheckThatOnlyAndroidUsersCanCallThisMethod,
        fnAppIsExists,
        fnAppUserHashPassword,
        fnFindUserAndDetectMode,
        fnUserGenerateIdIfNew,
        fnGetCurrentTime,
        fnUserGetProfileIfUpdateMode,
        fnUserCreateOrUpdate,
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

    if (flow.args.appId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'App ID is not defined'));
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
    if (flow.args.platform === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Platform is not defined'));
    }

    if (!validate.appId(flow.args.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect app id value: ' + flow.args.appId));
    }
    if (!validate.appUserLogin(flow.args.login)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Login must be a string with length [1, 64]'));
    }
    if (!validate.serviceUserPassword(flow.args.password)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]'));
    }
    if (!validate.appUserName(flow.args.name)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Name must be a string with length [0, 40]'));
    }
    if (!validate.platform(flow.args.platform)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect platform value: ' + flow.args.platform));
    }
    if (!validate.extra(flow.args.extra)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra value: ' + flow.args.extra));
    }

    if (flow.args.platform === domain.platforms.ANDROID) {
        if (flow.args.extra.deviceUuid === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Device UUID is not defined'));
        }
        if (flow.args.extra.gcmToken === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'GcmToken is not defined'));
        }

        if (!validate.deviceUuid(flow.args.extra.deviceUuid)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Device UUID must be a 32-symbols hex string'));
        }
        if (!validate.gcmToken(flow.args.extra.gcmToken)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Gcm Token must be a string with length [0, 4096]'));
        }
    }

    return cb(null, flow);
};

var fnCheckThatOnlyAndroidUsersCanCallThisMethod = function (flow, cb) {
    if (flow.args.platform !== domain.platforms.ANDROID) {
        cb(errBuilder(dErr.LOGIC_ERROR, 'Only Android users can init'));
    } else {
        cb(null, flow);
    }
};

var fnAppIsExists = function (flow, cb) {
    var reqArgs = {
        appId: flow.args.appId
    };
    flow.env.dal.apps_isExists(reqArgs, function(err, exists) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (typeof exists !== 'boolean') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'isAppExists returned invalid response. Boolean is expected, result is: ' + exists));
        } else if (!exists) {
            cb(errBuilder(dErr.APP_NOT_FOUND, 'Application with specified ID is not found. #ID: ' + flow.args.appId));
        } else {
            cb(null, flow);
        }
    });
};

var fnAppUserHashPassword = function (flow, cb) {
    flow.env.securityManager.hashAppUserPassword(flow.args.password, function(err, passwordHash) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.passwordHash = passwordHash;
            cb(null, flow);
        }
    });
};

var fnFindUserAndDetectMode = function (flow, cb) {
    var reqArgs = {
        appId: flow.args.appId,
        login: flow.args.login
    };
    flow.env.dal.appUsers_getCredentialsByLogin(reqArgs, function(err, creditionals) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (creditionals === null) {
            flow.mode = MODE_CREATE;
            cb(null, flow);
        } else if (typeof creditionals !== 'object') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'DAL returned invalid response. Expected - object, received: ' + creditionals));
        } else {
            if (flow.passwordHash !== creditionals.passwordHash) {
                cb(errBuilder(dErr.INVALID_PASSWORD, 'User with specified login has another password'));
            } else {
                flow.mode = MODE_UPDATE;
                flow.userId = creditionals.id;
                cb(null, flow);
            }
        }
    });
};

var fnUserGenerateIdIfNew = function (flow, cb) {
    if (flow.mode === MODE_CREATE) {
        flow.env.uuid.newBigInt(function(err, userId) {
            if (err) {
                cb(errBuilder(dErr.INTERNAL_ERROR, err));
            } else {
                flow.userId = userId;
                cb(null, flow);
            }
        });
    } else {
        cb(null, flow);
    }
};

var fnGetCurrentTime = function (flow, cb) {
    flow.env.configProvider.getCurrentDateUtc(function(err, currentTime) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.currentTime = currentTime;
            cb(null, flow);
        }
    });
};

var fnUserGetProfileIfUpdateMode = function (flow, cb) {
    if (flow.mode === MODE_UPDATE) {
        var reqArgs = {
            id: flow.userId
        };
        flow.env.dal.appUsers_getProfileById(reqArgs, function(err, profile) {
            if (err) {
                cb(errBuilder(dErr.INTERNAL_ERROR, err));
            } else if (profile === null) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'User is exists, but profile cannot be retrieved'));
            } else {
                flow.currentProfile = profile;
                cb(null, flow);
            }
        });
    } else {
        cb(null, flow);
    }
};

var fnUserCreateOrUpdate = function (flow, cb) {
    var newUserProfile;

    if (flow.mode === MODE_CREATE) {
        newUserProfile = {
            id: flow.userId,
            appId: flow.args.appId,
            login: flow.args.login,
            passwordHash: flow.passwordHash,
            name: flow.args.name,
            registered: flow.currentTime,
            lastVisit: flow.currentTime,
            platform: flow.args.platform,
            extra: {
                deviceUuid: flow.args.extra.deviceUuid,
                gcmToken: flow.args.extra.gcmToken
            }
        };
        flow.env.dal.appUsers_create(newUserProfile, function(err) {
            if (err) {
                cb(errBuilder(dErr.INTERNAL_ERROR, err));
            } else {
                flow.newUserProfile = newUserProfile;
                cb(null, flow);
            }
        });
    } else {
        newUserProfile = flow.currentProfile;
        newUserProfile.name = flow.args.name;
        newUserProfile.lastVisit = flow.currentTime;
        newUserProfile.extra.deviceUuid = flow.args.extra.deviceUuid;
        newUserProfile.extra.gcmToken = flow.args.extra.gcmToken;

        flow.env.dal.appUsers_update(newUserProfile, function(err) {
            if (err) {
                cb(errBuilder(dErr.INTERNAL_ERROR, err));
            } else {
                flow.newUserProfile = newUserProfile;
                cb(null, flow);
            }
        });
    }
};

var fnGenerateResult = function (flow, cb) {
    flow.result = {
        isCreated: flow.mode === MODE_CREATE,
        profile: flow.newUserProfile
    };
    delete flow.result.profile.passwordHash;
    cb(null ,flow);
};


module.exports = fnExecute;