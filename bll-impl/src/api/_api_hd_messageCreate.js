/**
 * Created by UAS on 24.04.2014.
 */

"use strict";


var async = require('async');

var domain = require('../domain');
var dErr = domain.errors;

var validate = require('./_validation');
var filter = require('./_filter');
var errBuilder = require('./_errorBuilder');


var fnExecute = function (env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                userType: null,
                userId: null,
                appId: null,
                appOwnerServiceUserId: null,
                participantsInfo: null,
                newMessageId: null,
                newMessageCreateDate: null,
                newMessage: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnUserGetInfoByToken,
        fnCheckServiceUserIsExistsAndConfirmed,
        fnChatIsExists,
        fnChatGetAppIdItBelongsTo,
        fnUserIsAssociatedWithApp,
        fnAppUserIsCreatorOfChat,
        fnAppGetOwner,
        fnChatGetParticipants,
        fnMessageGenerateId,
        fnMessageGenerateCreateDate,
        fnMessageCreate,
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
    if (flow.args.message === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Message is not defined'));
    }

    if (!validate.accessToken(flow.args.accessToken)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + flow.args.accessToken));
    }
    if (!validate.chatId(flow.args.chatId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect chat id value: ' + flow.args.chatId));
    }
    if (!validate.message(flow.args.message)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect message value: ' + flow.args.message));
    }

    return cb(null, flow);
};

var fnUserGetInfoByToken = function (flow, cb) {
    var reqArgs = {
        token: flow.args.accessToken
    };
    flow.env.dal.userGetIdByToken(reqArgs, function(err, user) {
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
    } else {
        cb(null, flow);
    }
};

var fnChatIsExists = function (flow, cb) {
    var reqArgs = {
        chatId: flow.args.chatId
    };
    flow.env.dal.chatIsExists(reqArgs, function(err, result) {
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
    flow.env.dal.chatGetAppId(reqArgs, function(err, appId) {
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
        flow.env.dal.appUsersGetProfileById(reqArgs, function (err, userProfile) {
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
        flow.env.dal.appGetOwnerIdForAppById(reqArgs, function (err, userInfo) {
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
        flow.env.dal.chatIsUserTheCreator(reqArgs, function(err, isCreator) {
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

var fnAppGetOwner = function (flow, cb) {
    var reqArgs = {
        appId: flow.appId
    };
    flow.env.dal.appGetOwnerIdForAppById(reqArgs, function(err, appOwnerUser) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!appOwnerUser) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'Owner of application is not found. AppId: ' + appOwnerUser));
        } else {
            flow.appOwnerServiceUserId = appOwnerUser.id;
            cb(null, flow);
        }
    });
};

var fnChatGetParticipants = function (flow, cb) {
    var reqArgs = {
        chatId: flow.args.chatId
    };
    flow.env.dal.chatGetParticipantsInfo(reqArgs, function (err, participants) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            flow.participantsInfo = participants;
            cb(null, flow);
        }
    });
};

var fnMessageGenerateId = function (flow, cb) {
    flow.env.uuid.newBigInt(function(err, messageId) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!messageId || typeof messageId !== 'string') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Generated id for message is invalid: ' + messageId));
        } else {
            flow.newMessageId = messageId;
            cb(null, flow);
        }
    });
};

var fnMessageGenerateCreateDate = function (flow, cb) {
    flow.env.currentTimeProvider.getCurrentTime(function(err, currentDate) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!(currentDate instanceof Date)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Current time is not a Date type: ' + currentDate));
        } else {
            flow.newMessageCreateDate = currentDate;
            cb(null, flow);
        }
    });
};

var fnMessageCreate = function (flow, cb) {
    var isReadInfo = [];
    for (var i = 0; i < flow.participantsInfo.length; i++) {
        isReadInfo.push({
            userId: flow.participantsInfo[i].id,
            userType: flow.participantsInfo[i].type,
            isRead: flow.participantsInfo[i].type === flow.userType && flow.participantsInfo[i].id === flow.userId
        });
    }

    var newMessage = {
        id: flow.newMessageId,
        chatId: flow.args.chatId,
        userCreatorId: flow.userId,
        userCreatorType: flow.userType,
        created: flow.newMessageCreateDate,
        content: filter.message(flow.args.message),
        isRead: isReadInfo
    };

    flow.env.dal.messageCreate(newMessage, function(err) {
        if (err) {
            cb(err);
        } else {
            delete newMessage.appId;
            newMessage.isRead = true;

            flow.newMessage = newMessage;
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.result = flow.newMessage;
    cb(null, flow);
};


module.exports = fnExecute;