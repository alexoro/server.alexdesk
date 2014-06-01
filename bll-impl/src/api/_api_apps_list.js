/**
 * Created by UAS on 24.04.2014.
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
                userType: null,
                userId: null,
                appsMap: null,
                appsIds: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnUserGetInfoByToken,
        fnCheckThatServiceUserIsCallingThisMethod,
        fnCheckServiceUserIsExistsAndConfirmed,
        fnAppsGetList,
        fnAppsSetNumberOfChats,
        fnAppsSetNumberOfAllMessages,
        fnAppsSetNumberOfUnreadMessages,
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
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Arguments are not defined'));
    }
    if (typeof flow.args !== 'object') {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object'));
    }
    if (flow.args.accessToken === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Access token is not defined'));
    }
    if (!validate.accessToken(flow.args.accessToken)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + flow.args.accessToken));
    }

    return cb(null, flow);
};

var fnUserGetInfoByToken = function (flow, cb) {
    var reqArgs = {
        token: flow.args.accessToken
    };
    flow.env.dal.getUserMainInfoByToken(reqArgs, function(err, user) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!user) {
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

var fnAppsGetList = function (flow, cb) {
    var reqArgs = {
        userId: flow.userId
    };
    flow.env.dal.getAppsList(reqArgs, function(err, result) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.appsMap = {};
            flow.appsIds = [];
            for (var i = 0; i < result.length; i++) {
                flow.appsMap[result[i].id] = result[i];
                flow.appsIds.push(result[i].id);
            }
            cb(null, flow);
        }
    });
};

var fnAppsSetNumberOfChats = function (flow, cb) {
    var reqArgs = {
        appIds: flow.appsIds
    };
    flow.env.dal.getNumberOfChats(reqArgs, function(err, result) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            for (var i in result) {
                if(result.hasOwnProperty(i)) {
                    flow.appsMap[i].numberOfChats = result[i];
                }
            }
            cb(null, flow);
        }
    });
};

var fnAppsSetNumberOfAllMessages = function (flow, cb) {
    var reqArgs = {
        appIds: flow.appsIds
    };
    flow.env.dal.getNumberOfAllMessages(reqArgs, function(err, result) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            for (var i in result) {
                if(result.hasOwnProperty(i)) {
                    flow.appsMap[i].numberOfAllMessages = result[i];
                }
            }
            cb(null, flow);
        }
    });
};

var fnAppsSetNumberOfUnreadMessages = function (flow, cb) {
    flow.env.dal.getNumberOfUnreadMessages(flow.appsIds, flow.userType, flow.userId, function(err, result) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            for (var i in result) {
                if(result.hasOwnProperty(i)) {
                    flow.appsMap[i].numberOfUnreadMessages = result[i];
                }
            }
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.result = [];
    for (var i in flow.appsMap) {
        if(flow.appsMap.hasOwnProperty(i)) {
            flow.result.push(flow.appsMap[i]);
        }
    }
    cb(null, flow);
};


module.exports = fnExecute;