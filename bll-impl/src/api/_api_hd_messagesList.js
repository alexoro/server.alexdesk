/**
 * Created by UAS on 24.04.2014.
 */

"use strict";


var async = require('async');

var domain = require('../domain');
var dErr = domain.errors;

var validate = require('./_validation');
var errBuilder = require('./_errorBuilder');

var defaultOffset = -50;
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
                lastVisit: null,
                messages: null,
                currentDate: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnSetDefaultsIfRequired,
        fnUserGetInfoByToken,
        fnCheckServiceUserIsExistsAndConfirmed,
        fnChatIsExists,
        fnChatGetAppIdItBelongsTo,
        fnUserIsAssociatedWithApp,
        fnAppUserIsCreatorOfChat,
        fnUserGetLastVisitOfChat,
        fnChatGetMessagesList,
        fnGetCurrentTime,
        fnChatUpdateLastVisitForUser,
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
    if (flow.args.chatId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Chat id is not defined'));
    }

    if (!validate.accessToken(flow.args.accessToken)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + flow.args.accessToken));
    }
    if (!validate.chatId(flow.args.chatId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect chat id value: ' + flow.args.chatId));
    }

    if (flow.args.offset !== undefined && !validate.messagesListOffset(flow.args.offset)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Offset is invalid: ' + flow.args.offset));
    }
    if (flow.args.limit !== undefined && !validate.messagesListLimit(flow.args.limit)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Limit is invalid: ' + flow.args.limit));
    }

    return cb(null, flow);
};

var fnSetDefaultsIfRequired = function (flow, cb) {
    flow.args.offset = flow.args.offset || defaultOffset;
    flow.args.limit = flow.args.limit || defaultLimit;
    cb(null, flow);
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

var fnCheckServiceUserIsExistsAndConfirmed = function (flow, cb) {
    if (flow.userType === domain.userTypes.SERVICE_USER) {
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
    } else {
        cb(null, flow);
    }
};

var fnChatIsExists = function (flow, cb) {
    var reqArgs = {
        chatId: flow.args.chatId
    };
    flow.env.dal.isChatExists(reqArgs, function(err, result) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (typeof result !== 'boolean') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of isChatExists() is not a boolean type: ' + result));
        } else if (!result) {
            cb(errBuilder(dErr.CHAT_NOT_FOUND, 'Chat not found. ID: ' + flow.args.chatId));
        } else {
            cb(null, flow);
        }
    });
};

var fnChatGetAppIdItBelongsTo = function (flow, cb) {
    var reqArgs = {
        chatId: flow.args.chatId
    };
    flow.env.dal.getAppIdChatBelongsTo(reqArgs, function(err, appId) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (typeof appId !== 'string') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of getAppIdChatBelongsTo() is not a string: ' + appId));
        } else if (!validate.appId(appId)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Application ID for chat is invalid:. ID: ' + appId));
        } else {
            flow.appId = appId;
            cb(null, flow);
        }
    });
};

var fnUserIsAssociatedWithApp = function (flow, cb) {
    var reqArgs;
    if (flow.userType === domain.userTypes.APP_USER) {
        reqArgs = {
            id: flow.userId
        };
        flow.env.dal.getAppUserById(reqArgs, function (err, userProfile) {
            if (err) {
                cb(errBuilder(dErr.INTERNAL_ERROR, err));
            } else if (!userProfile || userProfile.appId !== flow.appId) {
                cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this chat'));
            } else {
                cb(null, flow);
            }
        });
    } else {
        reqArgs = {
            appId: flow.appId
        };
        flow.env.dal.getAppOwnerUserMainInfoByAppId(reqArgs, function (err, userInfo) {
            if (err) {
                cb(errBuilder(dErr.INTERNAL_ERROR, err));
            } else if (!userInfo || userInfo.id !== flow.userId) {
                cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this chat'));
            } else {
                cb(null, flow);
            }
        });
    }
};

var fnAppUserIsCreatorOfChat = function (flow, cb) {
    if (flow.userType === domain.userTypes.SERVICE_USER) {
        cb(null, flow);
    } else {
        var reqArgs = {
            chatId: flow.args.chatId,
            userType: flow.userType,
            userId: flow.userId
        };
        flow.env.dal.isUserTheCreatorOfChat(reqArgs, function(err, isCreator) {
            if (err) {
                cb(errBuilder(dErr.INTERNAL_ERROR, err));
            } else if (typeof isCreator !== 'boolean') {
                cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of isUserTheCreatorOfChat() is not a boolean type: ' + isCreator));
            } else if (!isCreator) {
                cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this chat'));
            } else {
                cb(null, flow);
            }
        });
    }
};

var fnUserGetLastVisitOfChat = function (flow, cb) {
    var reqArgs = {
        chatId: flow.args.chatId,
        userType: flow.userType,
        userId: flow.userId
    };
    flow.env.dal.getLastVisitOfUserToChat(reqArgs, function(err, lastVisit) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!(lastVisit instanceof Date)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of getLastVisitOfUserToChat() is not a Date type: ' + lastVisit));
        } else {
            flow.lastVisit = lastVisit;
            cb(null, flow);
        }
    });
};

var fnChatGetMessagesList = function (flow, cb) {
    var reqArgs = {
        chatId: flow.args.chatId,
        offset: flow.args.offset,
        limit: flow.args.limit
    };
    flow.env.dal.getMessagesList(reqArgs, function(err, messages) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!(messages instanceof Array)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'The result of getMessagesList() is not a Array type: ' + messages));
        } else {
            for (var i = 0; i < messages.length; i++) {
                delete messages[i].appId;
                delete messages[i].chatId;
                messages[i].isRead = messages[i].created.getTime() <= flow.lastVisit.getTime();
            }
            flow.messages = messages;
            cb(null, flow);
        }
    });
};

var fnGetCurrentTime = function (flow, cb) {
    flow.env.currentTimeProvider.getCurrentTime(function(err, currentDate) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!(currentDate instanceof Date)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Current time is not a Date type: ' + currentDate));
        } else {
            flow.currentDate = currentDate;
            cb(null, flow);
        }
    });
};

var fnChatUpdateLastVisitForUser = function (flow, cb) {
    var reqArgs = {
        chatId: flow.args.chatId,
        userType: flow.userType,
        userId: flow.userId,
        newLastVisit: flow.currentDate
    };
    flow.env.dal.updateLastVisitForChat(reqArgs, function(err) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.result = flow.messages;
    cb(null, flow);
};


module.exports = fnExecute;