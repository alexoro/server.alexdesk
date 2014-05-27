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

    if (args.login === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Login is not defined');
    }
    if (args.password === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password is not defined');
    }
    if (args.name === undefined) {
        return errBuilder(dErr.INVALID_PARAMS, 'Name is not defined');
    }

    if (!validate.email(args.login)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Service user login must be in email format');
    }
    if (!validate.serviceUserPassword(args.password)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Password must be a string with length [1, 64]');
    }
    if (!validate.serviceUserName(args.name)) {
        return errBuilder(dErr.INVALID_PARAMS, 'Name must be a string with length [0, 40]');
    }
};

var _create = function(env, args, next) {
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
                confirmExpires: null
            };
            cb(null , flow);
        },


        function(flow, cb) {
            flow.env.dal.getServiceUserCreditionalsByLogin({login: args.login}, function(err, creditionals) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else if (creditionals === null) {
                    cb(null, flow);
                } else if (typeof creditionals !== 'object') {
                    cb(errBuilder(dErr.INTERNAL_ERROR, 'DAL returned invalid response. Expected - object, received: ' + creditionals));
                } else {
                    cb(errBuilder(dErr.USER_ALREADY_EXISTS, 'User with specified login is already exists: ' + args.login));
                }
            });
        },
        function(flow, cb) {
            flow.env.uuid.newBigInt(function(err, userId) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.newUserId = userId;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            flow.env.currentTimeProvider.getCurrentTime(function(err, currentTime) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.currentTime = currentTime;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            flow.env.passwordManager.hashServiceUserPassword(args.password, function(err, passwordHash) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.passwordHash = passwordHash;
                    cb(null, flow);
                }
            });
        },
        function(flow, cb) {
            flow.filteredName = filter.serviceUserName(args.name);
            cb(null, flow);
        },

        function(flow, cb) {
            flow.env.uuid.newGuid4(function(err, id) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.confirmId = id;
                    cb(null, flow);
                }
            });
        },
        function (flow, cb) {
            env.accessTokenConfig.getExpireTimeForRegister(function (err, expires) {
                if (err) {
                    cb(errBuilder(dErr.INTERNAL_ERROR, err));
                } else {
                    flow.confirmExpires = expires;
                    cb(null, flow);
                }
            });
        },

        function(flow, cb) {
            var reqArgs = {
                id: flow.newUserId,
                login: args.login,
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
        },

        function (flow, cb) {
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


        },
        function (flow, cb) {
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
        }
    ];

    async.waterfall(
        fnStack,
        function(err, flow) {
            if (err) {
                next(err);
            } else {
                flow.createdUser.isConfirmed = false;
                var r = {
                    "confirmation": {
                        "id": flow.confirmId,
                        "expires": flow.confirmExpires
                    },
                    "user": flow.createdUser
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