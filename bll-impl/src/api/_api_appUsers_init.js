/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var _ = require('underscore');
var async = require('async');

var domain = require('../domain');

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

    if (args.appId === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'App ID is not defined');
    }
    if (args.login === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Login is not defined');
    }
    if (args.password === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password is not defined');
    }
    if (args.name === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Name is not defined');
    }
    if (args.platform === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Platform is not defined');
    }

    if (!validate.appId(args.appId)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect app id value: ' + args.appId);
    }
    if (!validate.appUserLogin(args.login)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Login must be a string with length [1, 64]');
    }
    if (!validate.serviceUserPassword(args.password)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]');
    }
    if (!validate.appUserName(args.name)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Name must be a string with length [0, 40]');
    }
    if (!validate.platform(args.platform)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect platform value: ' + args.platform);
    }
    if (!validate.extra(args.extra)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra value: ' + args.extra);
    }

    if (args.platform === domain.platforms.ANDROID) {
        if (args.extra.deviceUuid === undefined) {
            return errBuilder(dErr.INVALID_PARAMS, 'Device UUID is not defined');
        }
        if (args.extra.gcmToken === undefined) {
            return errBuilder(dErr.INVALID_PARAMS, 'GcmToken is not defined');
        }

        if (!validate.deviceUuid(args.extra.deviceUuid)) {
            return errBuilder(dErr.INVALID_PARAMS, 'Device UUID must be a 32-symbols hex string');
        }
        if (!validate.gcmToken(args.extra.gcmToken)) {
            return errBuilder(dErr.INVALID_PARAMS, 'Gcm Token must be a string with length [0, 4096]');
        }
    }
};

var MODE_CREATE = 1;
var MODE_UPDATE = 2;

var _create = function(env, args, next) {
    var dal = env.dal;
    var uuid = env.uuid;
    var dErr = domain.errors;

    var fnStack = [
        function(cb) {
            dal.isAppExists(args.appId, function(err, isExists) {
                if (typeof isExists !== 'boolean') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, '#isAppExists must return boolean. Actual: ' + isExists));
                } else if (!isExists) {
                    cb(errBuilder(dErr.APP_NOT_FOUND, 'Application is not exists. ID: ' + args.appId));
                } else {
                    cb(null);
                }
            });
        },

        function(cb) {
            var flow = {
                mode: null,
                userId: null,
                passwordHash: null,
                currentTime: null,
                filteredName: null,
                currentProfile: null
            };
            cb(null , flow);
        },

        function(flow, cb) {
            env.passwordManager.hashAppUserPassword(args.password, function(err, passwordHash) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.passwordHash = passwordHash;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            dal.getAppUserCreditionalsByLogin({appId: args.appId, login: args.login}, function(err, creditionals) {
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
        },

        function(flow, cb) {
            if (flow.mode === MODE_CREATE) {
                uuid.newBigInt(function(err, userId) {
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
        },

        function(flow, cb) {
            env.currentTimeProvider.getCurrentTime(function(err, currentTime) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.currentTime = currentTime;
                    cb(null, flow);
                }
            });
        },

        function(flow, cb) {
            flow.filteredName = filter.appUserName(args.name);
            cb(null, flow);
        },

        function(flow, cb) {
            if (flow.mode === MODE_UPDATE) {
                dal.getAppUserById({id: flow.userId}, function(err, profile) {
                    if (err) {
                        cb(errBuilder(dErr.INTERNAL_ERROR, err));
                    } else if (profile === null) {
                        cb(errBuilder(dErr.LOGIC_ERROR, 'User is exists, but it profile cannot be retrieved'));
                    } else {
                        flow.currentProfile = profile;
                        cb(null, flow);
                    }
                });
            } else {
                cb(null, flow);
            }
        },

        function(flow, cb) {
            var newUserProfile;

            if (flow.mode === MODE_CREATE) {
                newUserProfile = {
                    id: flow.userId,
                    appId: args.appId,
                    login: args.login,
                    passwordHash: flow.passwordHash,
                    name: flow.filteredName,
                    registered: flow.currentTime,
                    lastVisit: flow.currentTime,
                    platform: args.platform,
                    extra: {
                        deviceUuid: args.extra.deviceUuid,
                        gcmToken: args.extra.gcmToken
                    }
                };

                dal.createAppUserProfile({profile: newUserProfile}, function(err) {
                    if (err) {
                        cb(errBuilder(dErr.INTERNAL_ERROR, err));
                    } else {
                        cb(null, true, newUserProfile);
                    }
                });

            } else {
                newUserProfile = flow.currentProfile;
                newUserProfile.name = flow.filteredName;
                newUserProfile.lastVisit = flow.currentTime;
                newUserProfile.extra.deviceUuid = args.extra.deviceUuid;
                newUserProfile.extra.gcmToken = args.extra.gcmToken;

                dal.updateAppUserProfile({profile: newUserProfile}, function(err) {
                    if (err) {
                        cb(errBuilder(dErr.INTERNAL_ERROR, err));
                    } else {
                        cb(null, false, newUserProfile);
                    }
                });
            }
        }
    ];

    async.waterfall(
        fnStack,
        function(err, isCreated, profile) {
            if (err) {
                next(err);
            } else {
                delete profile.passwordHash;
                var r = {
                    isCreated: isCreated,
                    profile: profile
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