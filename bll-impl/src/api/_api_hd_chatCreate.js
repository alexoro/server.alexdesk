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
                appId: null,
                appOwnerServiceUserId: null,
                newChatId: null,
                newMessageId: null,
                createDate: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnCheckThatOnlyAndroidUsersCanCallThisMethod,
        fnAppIsExists,
        fnUserGetInfoByToken,
        fnCheckThatAppUserCalledThisMethod,
        fnUserIsAssociatedWithApp,
        fnAppGetOwner,
        fnChatGenerateId,
        fnMessageGenerateId,
        fnGenerateCreateDate,
        fnChatCreateAndGenerateResult
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

    // validate main
    if (flow.args.accessToken === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Access token is not defined'));
    }
    if (flow.args.appId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'App id is not defined'));
    }
    if (flow.args.message === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Message is not defined'));
    }
    if (flow.args.platform === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Platform is not defined'));
    }
    if (flow.args.extra === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Extra is not defined'));
    }

    if (!validate.accessToken(flow.args.accessToken)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect access token value: ' + flow.args.accessToken));
    }
    if (!validate.appId(flow.args.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect app id value: ' + flow.args.appId));
    }
    if (!validate.message(flow.args.message)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect message value: ' + flow.args.message));
    }
    if (!validate.platform(flow.args.platform)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect platform value: ' + flow.args.platform));
    }
    if (!validate.extra(flow.args.extra)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra value: ' + flow.args.extra));
    }

    // validate extra
    if (flow.args.platform === domain.platforms.ANDROID) {
        if (flow.args.extra.country === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Country is not defined'));
        }
        if (flow.args.extra.lang === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Language is not defined'));
        }
        if (flow.args.extra.api === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'API is not defined'));
        }
        if (flow.args.extra.apiTextValue === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Api Text Value is not defined'));
        }
        if (flow.args.extra.appBuild === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'App Build is not defined'));
        }
        if (flow.args.extra.appVersion === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'App Version is not defined'));
        }
        if (flow.args.extra.deviceManufacturer === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Device Manufacturer is not defined'));
        }
        if (flow.args.extra.deviceModel === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Device Model is not defined'));
        }
        if (flow.args.extra.deviceWidthPx === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'DeviceWidthPx is not defined'));
        }
        if (flow.args.extra.deviceHeightPx === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'DeviceHeightPx is not defined'));
        }
        if (flow.args.extra.deviceDensity === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'DeviceDensity is not defined'));
        }
        if (flow.args.extra.isRooted === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'IsRooted is not defined'));
        }
        if (flow.args.extra.metaData === undefined) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'MetaData is not defined'));
        }

        if (!validate.countryCode2(flow.args.extra.country)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect country value: ' + flow.args.extra.country));
        }
        if (!validate.langCode2(flow.args.extra.lang)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect language value: ' + flow.args.extra.lang));
        }
        if (!validate.apiAndroid(flow.args.extra.api)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect api value: ' + flow.args.extra.api));
        }
        if (!validate.apiAndroidTextValue(flow.args.extra.apiTextValue)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect api text value: ' + flow.args.extra.apiTextValue));
        }
        if (!validate.appBuild(flow.args.extra.appBuild)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect app build value: ' + flow.args.extra.appBuild));
        }
        if (!validate.appVersion(flow.args.extra.appVersion)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect app version value: ' + flow.args.extra.appVersion));
        }
        if (!validate.deviceManufacturer(flow.args.extra.deviceManufacturer)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect device manufacturer value: ' + flow.args.extra.deviceManufacturer));
        }
        if (!validate.deviceModel(flow.args.extra.deviceModel)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect device model value: ' + flow.args.extra.deviceModel));
        }
        if (!validate.deviceWidthPx(flow.args.extra.deviceWidthPx)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect device width px value: ' + flow.args.extra.deviceWidthPx));
        }
        if (!validate.deviceHeightPx(flow.args.extra.deviceHeightPx)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect device height px value: ' + flow.args.extra.deviceHeightPx));
        }
        if (!validate.deviceDensity(flow.args.extra.deviceDensity)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect device density value: ' + flow.args.extra.deviceDensity));
        }
        if (!validate.isRooted(flow.args.extra.isRooted)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect is rooted value: ' + flow.args.extra.isRooted));
        }
        if (!validate.metaData(flow.args.extra.metaData)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect meta data value: ' + flow.args.extra.metaData));
        }
    }

    return cb(null, flow);
};

var fnCheckThatOnlyAndroidUsersCanCallThisMethod = function (flow, cb) {
    if (flow.args.platform !== domain.platforms.ANDROID) {
        cb(errBuilder(dErr.LOGIC_ERROR, 'Only Android users can create chats'));
    } else {
        cb(null, flow);
    }
};

var fnAppIsExists = function (flow, cb) {
    var reqArgs = {
        appId: flow.args.appId
    };
    flow.env.dal.appIsExists(reqArgs, function(err, exists) {
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

var fnCheckThatAppUserCalledThisMethod = function (flow, cb) {
    if (flow.userType !== domain.userTypes.APP_USER) {
        cb(errBuilder(dErr.LOGIC_ERROR, 'Only app users can create chats'));
    } else {
        cb(null, flow);
    }
};

var fnUserIsAssociatedWithApp = function (flow, cb) {
    var reqArgs = {
        id: flow.userId
    };
    flow.env.dal.appUsersGetProfileById(reqArgs, function (err, userProfile) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!userProfile || userProfile.appId !== flow.args.appId) {
            cb(errBuilder(dErr.ACCESS_DENIED, 'You have no access to this chat'));
        } else {
            cb(null, flow);
        }
    });
};

var fnAppGetOwner = function (flow, cb) {
    var reqArgs = {
        appId: flow.args.appId
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

var fnChatGenerateId = function (flow, cb) {
    flow.env.uuid.newBigInt(function(err, id) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!id || typeof id !== 'string') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Generated id for chat is invalid: ' + id));
        } else {
            flow.newChatId = id;
            cb(null, flow);
        }
    });
};

var fnMessageGenerateId = function (flow, cb) {
    flow.env.uuid.newBigInt(function(err, id) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!id || typeof id !== 'string') {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Generated id for message is invalid: ' + id));
        } else {
            flow.newMessageId = id;
            cb(null, flow);
        }
    });
};

var fnGenerateCreateDate = function (flow, cb) {
    flow.env.configManager.getCurrentDateUtc(function(err, dateNow) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else if (!dateNow || !(dateNow instanceof Date)) {
            cb(errBuilder(dErr.INTERNAL_ERROR, 'Current date is invalid object: ' + dateNow));
        } else {
            flow.createDate = dateNow;
            cb(null, flow);
        }
    });
};

var fnChatCreateAndGenerateResult = function (flow, cb) {
    var reqArgs = {};

    reqArgs.newChat = {
        id: flow.newChatId,
        appId: flow.args.appId,
        userCreatorId: flow.userId,
        userCreatorType: flow.userType,
        created: flow.createDate,
        title: '',
        type: domain.chatTypes.UNKNOWN,
        status: domain.chatStatuses.UNKNOWN,
        platform: flow.args.platform,
        extra: {
            countryId: domain.countries.getIdByCode(flow.args.extra.country),
            langId: domain.languages.getIdByCode(flow.args.extra.lang),
            api: flow.args.extra.api,
            apiTextValue: flow.args.extra.apiTextValue,
            appBuild: flow.args.extra.appBuild,
            appVersion: flow.args.extra.appVersion,
            deviceManufacturer: flow.args.extra.deviceManufacturer,
            deviceModel: flow.args.extra.deviceModel,
            deviceWidthPx: flow.args.extra.deviceWidthPx,
            deviceHeightPx: flow.args.extra.deviceHeightPx,
            deviceDensity: flow.args.extra.deviceDensity,
            isRooted: flow.args.extra.isRooted,
            metaData: flow.args.extra.metaData
        },
        participants: [
            {
                userId: flow.userId,
                userType: flow.userType
            },
            {
                userId: flow.appOwnerServiceUserId,
                userType: domain.userTypes.SERVICE_USER
            }
        ]
    };
    reqArgs.newMessage = {
        id: flow.newMessageId,
        chatId: flow.newChatId,
        userCreatorId: flow.userId,
        userCreatorType: flow.userType,
        created: flow.createDate,
        content: flow.args.message,
        isRead: [
            {
                userId: flow.userId,
                userType: flow.userType,
                isRead: true
            },
            {
                userId: flow.appOwnerServiceUserId,
                userType: domain.userTypes.SERVICE_USER,
                isRead: false
            }
        ]
    };

    flow.env.dal.chatCreateWithMessage(reqArgs, function(err) {
        if (err) {
            cb(errBuilder(dErr.INTERNAL_ERROR, err));
        } else {
            reqArgs.newChat.message = reqArgs.newMessage;
            delete reqArgs.newChat.participants;
            reqArgs.newChat.message.isRead = true;
            flow.result = reqArgs.newChat;
            cb(null, flow);
        }
    });
};


module.exports = fnExecute;