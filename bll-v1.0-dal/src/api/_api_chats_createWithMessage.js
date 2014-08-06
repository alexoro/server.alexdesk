/**
 * Created by UAS on 10.06.2014.
 */

"use strict";


var async = require('async');
var pg = require('pg');

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
                client: null,
                clientDone: null,
                appPlatform: -1,
                inTransaction: false,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnDbConnect,
        fnSetNames,
        fnGetAppPlatform,
        fnTransactionBegin,
        fnCreateChat,
        fnCreateChatExtra,
        fnCreateParticipants,
        fnCreateMessage,
        fnCreateMessageExtra,
        fnTransactionCommit,
        fnGenerateResult
    ];

    async.waterfall(
        fnStack,
        fnTasksFinishProcessor(next)
    );
};


var fnValidate = function (flow, cb) {
    var i;

    if (!flow.args) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Args is not a defined'), flow);
    }
    if (typeof flow.args !== 'object') {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Args is not a object'), flow);
    }

    // new chat

    if (flow.args.newChat === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'newChat is not defined'), flow);
    }
    if (typeof flow.args.newChat !== 'object' || flow.args.newChat === null) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'newChat is not a object or is null'), flow);
    }
    if (!validate.positiveBigInt(flow.args.newChat.id)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.id value: ' + flow.args.newChat.id), flow);
    }
    if (!validate.positiveBigInt(flow.args.newChat.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.appId value: ' + flow.args.newChat.appId), flow);
    }
    if (!validate.positiveBigInt(flow.args.newChat.userCreatorId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.userCreatorId value: ' + flow.args.newChat.userCreatorId), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.userCreatorType)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.userCreatorType value: ' + flow.args.newChat.userCreatorType), flow);
    }
    if (!validate.date(flow.args.newChat.created)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.created value: ' + flow.args.newChat.created), flow);
    }
    if (!validate.varchar(flow.args.newChat.title, 0, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.title value: ' + flow.args.newChat.title), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.type)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.type value: ' + flow.args.newChat.type), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.status)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.status value: ' + flow.args.newChat.status), flow);
    }
    if (!validate.date(flow.args.newChat.lastUpdate)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.lastUpdate value: ' + flow.args.newChat.lastUpdate), flow);
    }

    if (flow.args.newChat.extra === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'newChat.extra is not defined'), flow);
    }
    if (typeof flow.args.newChat.extra !== 'object' || flow.args.newChat.extra === null) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'newChat.extra is not a object or is null'), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.extra.countryId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.countryId value: ' + flow.args.newChat.extra.countryId), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.extra.langId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.langId value: ' + flow.args.newChat.extra.langId), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.extra.api)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.api value: ' + flow.args.newChat.extra.api), flow);
    }
    if (!validate.varchar(flow.args.newChat.extra.apiTextValue, 0, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.apiTextValue value: ' + flow.args.newChat.extra.apiTextValue), flow);
    }
    if (!validate.positiveInt(flow.args.newChat.extra.appBuild)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.appBuild value: ' + flow.args.newChat.extra.appBuild), flow);
    }
    if (!validate.varchar(flow.args.newChat.extra.appVersion, 0, 20)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.appVersion value: ' + flow.args.newChat.extra.appVersion), flow);
    }
    if (!validate.varchar(flow.args.newChat.extra.deviceManufacturer, 0, 20)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.deviceManufacturer value: ' + flow.args.newChat.extra.deviceManufacturer), flow);
    }
    if (!validate.varchar(flow.args.newChat.extra.deviceModel, 0, 20)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.deviceModel value: ' + flow.args.newChat.extra.deviceModel), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.extra.deviceWidthPx)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.deviceWidthPx value: ' + flow.args.newChat.extra.deviceWidthPx), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.extra.deviceHeightPx)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.deviceHeightPx value: ' + flow.args.newChat.extra.deviceHeightPx), flow);
    }
    if (!validate.positiveSmallInt(flow.args.newChat.extra.deviceDensity)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.deviceDensity value: ' + flow.args.newChat.extra.deviceDensity), flow);
    }
    if (!validate.bool(flow.args.newChat.extra.isRooted)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.isRooted value: ' + flow.args.newChat.extra.isRooted), flow);
    }
    if (!validate.varchar(flow.args.newChat.extra.metaData, 0, 4096)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.extra.metaData value: ' + flow.args.newChat.extra.metaData), flow);
    }

    if (!(flow.args.newChat.participants instanceof Array)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'newChat.participants is not an Array'), flow);
    }
    for (i = 0; i < flow.args.newChat.participants.length; i++) {
        if (typeof flow.args.newChat.participants[i] !== 'object' || flow.args.newChat.participants[i] === null) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect flow.args.newChat.participants['+i+'] value: ' + flow.args.newChat.participants[i]), flow);
        }
        if (!validate.positiveBigInt(flow.args.newChat.participants[i].userId)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.participants['+i+'].userId value: ' + flow.args.newChat.participants[i].userId), flow);
        }
        if (!validate.positiveSmallInt(flow.args.newChat.participants[i].userType)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newChat.participants['+i+'].userType value: ' + flow.args.newChat.participants[i].userType), flow);
        }
    }


    // new message

    if (flow.args.newMessage === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'newMessage is not defined'), flow);
    }
    if (typeof flow.args.newMessage !== 'object' || flow.args.newMessage === null) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'newMessage is not a object or is null'), flow);
    }
    if (!validate.positiveBigInt(flow.args.newMessage.id)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newMessage.id value: ' + flow.args.newMessage.id), flow);
    }
    if (!validate.date(flow.args.newMessage.created)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newMessage.created value: ' + flow.args.newMessage.created), flow);
    }
    if (!validate.varchar(flow.args.newMessage.content, 0, 4096)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newMessage.content value: ' + flow.args.newMessage.content), flow);
    }
    if (!(flow.args.newMessage.isRead instanceof Array)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'newMessage.isRead is not an Array'), flow);
    }
    for (i = 0; i < flow.args.newMessage.isRead.length; i++) {
        if (typeof flow.args.newMessage.isRead[i] !== 'object' || flow.args.newMessage.isRead[i] === null) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newMessage.isRead['+i+'] value: ' + flow.args.newMessage.isRead[i]), flow);
        }
        if (!validate.positiveBigInt(flow.args.newMessage.isRead[i].userId)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newMessage.isRead['+i+'].userId value: ' + flow.args.newMessage.isRead[i].userId), flow);
        }
        if (!validate.positiveSmallInt(flow.args.newMessage.isRead[i].userType)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newMessage.isRead['+i+'].userType value: ' + flow.args.newMessage.isRead[i].userType), flow);
        }
        if (!validate.bool(flow.args.newMessage.isRead[i].isRead)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect newMessage.isRead['+i+'].isRead value: ' + flow.args.newMessage.isRead[i].isRead), flow);
        }
    }

    return cb(null, flow);
};

var fnDbConnect = function (flow, cb) {
    pg.connect(flow.env.pgConnectStr, function (err, client, clientDone) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        }
        flow.client = client;
        flow.clientDone = clientDone;
        cb(null, flow);
    });
};

var fnSetNames = function (flow, cb) {
    flow.client.query("SET NAMES 'UTF8'", function (err) {
        cb(err, flow);
    });
};


var preparedGetAppPlatform = 'SELECT platform_type FROM public.apps WHERE id = $1';

var fnGetAppPlatform = function (flow, cb) {
    flow.client.query(preparedGetAppPlatform, [flow.args.newChat.appId], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length === 0) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'Application is not found. Given ID: #' + flow.args.newChat.appId), flow);
        } else if (result.rows.length > 1) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 application is found for ID #' + flow.args.newChat.appId), flow);
        } else {
            flow.appPlatform = parseInt(result.rows[0].platform_type);
            if (flow.appPlatform !== domain.platforms.ANDROID) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'Only Android platform and extra info is supported'), flow);
            } else {
                cb(null, flow);
            }
        }
    });
};

var fnTransactionBegin = function (flow, cb) {
    flow.client.query('BEGIN', function (err) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            flow.inTransaction = true;
            cb(null, flow);
        }
    });
};


var preparedCreateChat =
    'INSERT INTO public.chats (id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update) ' +
    'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';

var fnCreateChat = function (flow, cb) {
    var args = [
        flow.args.newChat.id,
        flow.args.newChat.appId,
        flow.args.newChat.userCreatorId,
        flow.args.newChat.userCreatorType,
        flow.args.newChat.created,
        flow.args.newChat.title,
        flow.args.newChat.type,
        flow.args.newChat.status,
        flow.args.newChat.lastUpdate
    ];
    flow.client.query(preparedCreateChat, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            cb(null, flow);
        }
    });
};


var preparedCreateChatExtra =
    'INSERT INTO public.chat_extra_android (chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version, ' +
        'device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data) ' +
    'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';

var fnCreateChatExtra = function (flow, cb) {
    var args = [
        flow.args.newChat.id,
        flow.args.newChat.appId,
        flow.args.newChat.extra.countryId,
        flow.args.newChat.extra.langId,
        flow.args.newChat.extra.api,
        flow.args.newChat.extra.apiTextValue,
        flow.args.newChat.extra.appBuild,
        flow.args.newChat.extra.appVersion,
        flow.args.newChat.extra.deviceManufacturer,
        flow.args.newChat.extra.deviceModel,
        flow.args.newChat.extra.deviceWidthPx,
        flow.args.newChat.extra.deviceHeightPx,
        flow.args.newChat.extra.deviceDensity,
        flow.args.newChat.extra.isRooted,
        flow.args.newChat.extra.metaData
    ];
    flow.client.query(preparedCreateChatExtra, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            cb(null, flow);
        }
    });
};


var preparedCreateParticipants =
    'INSERT INTO public.chat_participants (chat_id, user_type, user_id) ' +
    'VALUES($1, $2, $3)';

var fnCreateParticipants = function (flow, cb) {
    var fnStack = [];
    for (var i = 0; i < flow.args.newChat.participants.length; i++) {
        (function (chatId, userId, userType) {
            fnStack.push(function (cbInner) {
                flow.client.query(preparedCreateParticipants, [chatId, userId, userType], function (err) {
                    if (err) {
                        return cbInner(err);
                    } else {
                        cbInner(null, flow);
                    }
                });
            });
        })(flow.args.newChat.id, flow.args.newChat.participants[i].userId, flow.args.newChat.participants[i].userType);
    }

    async.series(
        fnStack,
        function (err) {
            if (err) {
                return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else {
                cb(null, flow);
            }
        }
    );
};


var preparedCreateMessage =
    'INSERT INTO public.chat_messages (id, app_id, chat_id, user_creator_id, user_creator_type, created, content) ' +
    'VALUES($1, $2, $3, $4, $5, $6, $7)';

var fnCreateMessage = function (flow, cb) {
    var args = [
        flow.args.newMessage.id,
        flow.args.newChat.appId,
        flow.args.newChat.id,
        flow.args.newChat.userCreatorId,
        flow.args.newChat.userCreatorType,
        flow.args.newMessage.created,
        flow.args.newMessage.content
    ];
    flow.client.query(preparedCreateMessage, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            cb(null, flow);
        }
    });
};


var preparedCreateMessageExtra =
    'INSERT INTO public.chat_messages_extra (app_id, chat_id, message_id, user_id, user_type, is_read) ' +
    'VALUES($1, $2, $3, $4, $5, $6)';

var fnCreateMessageExtra = function (flow, cb) {
    var fnStack = [];
    for (var i = 0; i < flow.args.newMessage.isRead.length; i++) {
        var args = [
            flow.args.newChat.appId,
            flow.args.newChat.id,
            flow.args.newMessage.id,
            flow.args.newMessage.isRead[i].userId,
            flow.args.newMessage.isRead[i].userType,
            flow.args.newMessage.isRead[i].isRead
        ];
        (function (argsInner) {
            fnStack.push(function (cbInner) {
                flow.client.query(preparedCreateMessageExtra, argsInner, function (err) {
                    if (err) {
                        return cbInner(err);
                    } else {
                        cbInner(null, flow);
                    }
                });
            });
        })(args);
    }

    async.series(
        fnStack,
        function (err) {
            if (err) {
                return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else {
                cb(null, flow);
            }
        }
    );
};

var fnTransactionCommit = function (flow, cb) {
    flow.client.query('COMMIT', function (err) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            flow.inTransaction = false;
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.result = null;
    cb(null, flow);
};

var fnTasksFinishProcessor = function (next) {
    return function(errFlow, flow) {
        if (errFlow) {
            if (flow.client) {
                if (flow.inTransaction) {
                    flow.client.query('ROLLBACK', function (errRollback) {
                        flow.clientDone();
                        next(errRollback || errFlow);
                    });
                } else {
                    flow.clientDone();
                    next(errFlow);
                }
            } else {
                next(errFlow);
            }
        } else {
            flow.clientDone();
            next(null, flow.result);
        }
    };
};


module.exports = fnExecute;