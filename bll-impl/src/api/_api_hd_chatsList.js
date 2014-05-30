/**
 * Created by UAS on 24.04.2014.
 */

"use strict";


var async = require('async');

var domain = require('../domain');
var dErr = domain.errors;

var validate = require('./_validation');
var errBuilder = require('./_errorBuilder');

var defaultOffset = 0;
var defaultLimit = 50;


var fnExecute = function (env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                userType: null,
                userId: null,
                appId: null,
                chatsList: null,
                chatIds: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnSetDefaultsIfRequired,
        fnAppIsExists,
        fnUserGetInfoByToken,
        fnServiceUserIsConfirmed,
        fnUserIsAssociatedWithApp,
        fnChatsGetList,
        fnChatsSetNumberOfUnreadMessages,
        fnChatsSetLastMessage,
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
    if (flow.args.appId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Application id is not defined'));
    }

    if (!validate.accessToken(flow.args.accessToken)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + flow.args.accessToken));
    }
    if (!validate.appId(flow.args.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect api id value: ' + flow.args.appId));
    }

    if (flow.args.offset !== undefined && !validate.chatsListOffset(flow.args.offset)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Offset is invalid: ' + flow.args.offset));
    }
    if (flow.args.limit !== undefined && !validate.chatsListLimit(flow.args.limit)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Limit is invalid: ' + flow.args.limit));
    }

    return cb(null, flow);
};

var fnSetDefaultsIfRequired = function (flow, cb) {
    flow.args.offset = flow.args.offset || defaultOffset;
    flow.args.limit = flow.args.limit || defaultLimit;
    cb(null, flow);
};


var fnAppIsExists = function (flow, cb) {
    flow.env.dal.isAppExists(flow.args.appId, function(err, exists) {
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

var fnUserGetInfoByToken = function (flow, cb) {
    flow.env.dal.getUserMainInfoByToken(flow.args.accessToken, function(err, user) {
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

var fnServiceUserIsConfirmed = function (flow, cb) {
    if (flow.userType === domain.userTypes.SERVICE_USER) {
        var reqArgs = {
            userId: flow.userId
        };
        flow.env.dal.serviceUserIsConfirmed(reqArgs, function (err, isConfirmed) {
            if (err) {
                cb(errBuilder(dErr.INTERNAL_ERROR, err));
            } else if (!isConfirmed) {
                cb(errBuilder(dErr.USER_NOT_CONFIRMED, 'User not confirmed'));
            } else {
                cb(null, flow);
            }
        });
    } else {
        cb(null, flow);
    }
};

var fnUserIsAssociatedWithApp = function (flow, cb) {
    flow.env.dal.userIsAssociatedWithApp(flow.args.appId, flow.userType, flow.userId, function(err, isAssociated) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (typeof isAssociated !== 'boolean') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of userIsAssociatedWithApp() is not a boolean type: ' + isAssociated));
        } else if (!isAssociated) {
            cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this chat'));
        } else {
            cb(null, flow);
        }
    });
};

var fnChatsGetList = function (flow, cb) {
    var reqArgs = {
        appId: flow.args.appId,
        userCreatorId: flow.userType === domain.userTypes.SERVICE_USER ? null : flow.userId,
        offset: flow.args.offset,
        limit: flow.args.limit
    };
    flow.env.dal.getChatsList(reqArgs, function(err, chats) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!(chats instanceof Array)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'It is expected that #getChatsList will be an array. Received: ' + chats));
        } else {
            flow.chatsList = chats;
            flow.chatIds = [];
            for (var i = 0; i < flow.chatsList.length; i++) {
                flow.chatIds.push(flow.chatsList[i].id);
            }
            cb(null, flow);
        }
    });
};

var fnChatsSetNumberOfUnreadMessages = function (flow, cb) {
    var reqArgs = {
        chatIds: flow.chatIds,
        userType: flow.userType,
        userId: flow.userId
    };
    flow.env.dal.getNumberOfUnreadMessagesPerChats(reqArgs, function(err, result) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            for (var i = 0; i < flow.chatsList.length; i++) {
                flow.chatsList[i].numberOfUnreadMessages = result[flow.chatsList[i].id];
            }
            cb(null, flow);
        }
    });
};

var fnChatsSetLastMessage = function (flow, cb) {
    flow.env.dal.getLastMessagePerChats(flow.chatIds, function(err, result) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            for (var i = 0; i < flow.chatsList.length; i++) {
                delete result[flow.chatsList[i].id].chatId;
                delete result[flow.chatsList[i].id].appId;
                flow.chatsList[i].lastMessage = result[flow.chatsList[i].id];
            }
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.result = flow.chatsList;
    cb(null, flow);
};


module.exports = fnExecute;