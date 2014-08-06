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
var api_chatsGetLastMessagePerChat = require('./_api_chats_getLastMessagePerChat');


var fnExecute = function (env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env,
                chatIds: null,
                chatsMap: null,
                appPlatform: null,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnDbConnect,
        fnSetNames,
        fnGetChatsInfo,
        fnGetAppPlatform,
        fnGetChatsExtra,
        fnGetLastMessage,
        fnSortAndGenerateResult
    ];

    async.waterfall(
        fnStack,
        fnTasksFinishProcessor(next)
    );
};


var fnValidate = function (flow, cb) {
    if (!flow.args) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Args is not a defined'), flow);
    }
    if (typeof flow.args !== 'object') {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Args is not a object'), flow);
    }

    if (flow.args.appId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'appId is not defined'), flow);
    }
    if (!validate.positiveBigInt(flow.args.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect appId value: ' + flow.args.appId), flow);
    }

    if (flow.args.limit === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'limit is not defined'), flow);
    }
    if (!validate.int(flow.args.limit, 0, 100)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect limit value: ' + flow.args.limit), flow);
    }

    if (flow.args.offset === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'offset is not defined'), flow);
    }
    if (!validate.int(flow.args.offset, -2147483648, 2147483647)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect offset value: ' + flow.args.offset), flow);
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


var preparedGetChatsInfoForAppPositiveOffset =
    'SELECT id::text, app_id::text, user_creator_id::text, user_creator_type, created, title, type, status, last_update ' +
    'FROM public.chats ' +
    'WHERE app_id = $1 ' +
    'ORDER BY last_update ASC ' +
    'LIMIT $2 OFFSET $3';
var preparedGetChatsInfoForAppNegativeOffset =
    'SELECT id::text, app_id::text, user_creator_id::text, user_creator_type, created, title, type, status, last_update ' +
    'FROM public.chats ' +
    'WHERE app_id = $1 ' +
    'ORDER BY last_update DESC ' + // change of ASC to DESC
    'LIMIT $2 OFFSET $3';

var fnGetChatsInfo = function (flow, cb) {
    var query;
    var args;

    if (flow.args.offset >= 0) {
        query = preparedGetChatsInfoForAppPositiveOffset;
        args = [
            flow.args.appId,
            flow.args.limit,
            flow.args.offset
        ];
    } else {
        query = preparedGetChatsInfoForAppNegativeOffset;
        args = [
            flow.args.appId,
                -flow.args.offset > flow.args.limit ? flow.args.limit : -flow.args.offset,
            Math.max(0, -flow.args.offset - flow.args.limit)
        ];
    }

    flow.client.query(query, args, function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            flow.chatIds = [];
            flow.chatsMap = {};
            for (var i = 0; i < result.rows.length; i++) {
                flow.chatIds.push(result.rows[i].id);
                flow.chatsMap[result.rows[i].id] = {
                    id: result.rows[i].id,
                    appId: result.rows[i].app_id,
                    userCreatorId: result.rows[i].user_creator_id,
                    userCreatorType: parseInt(result.rows[i].user_creator_type),
                    created: result.rows[i].created,
                    title: result.rows[i].title,
                    type: parseInt(result.rows[i].type),
                    status: parseInt(result.rows[i].status),
                    lastUpdate: result.rows[i].last_update,
                    extra: {},
                    lastMessage: null
                };
            }
            cb(null, flow);
        }
    });
};


var preparedGetAppPlatform = 'SELECT platform_type FROM public.apps WHERE id = $1';

var fnGetAppPlatform = function (flow, cb) {
    if (flow.chatIds.length === 0) {
        cb(null, flow);
    } else {
        flow.client.query(preparedGetAppPlatform, [flow.args.appId], function (err, result) {
            if (err) {
                cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else if (result.rows.length === 0) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'Application is not found w/ ID #' + flow.args.appId), flow);
            } else if (result.rows.length > 1) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 application is found for ID #' + flow.args.appId), flow);
            } else {
                flow.appPlatform = parseInt(result.rows[0].platform_type);
                if (flow.appPlatform !== domain.platforms.ANDROID) {
                    cb(errBuilder(dErr.LOGIC_ERROR, 'Only Android-chats are supported'), flow);
                } else {
                    cb(null, flow);
                }
            }
        });
    }
};


var preparedGetChatsExtra =
    'SELECT chat_id::text, country_id, lang_id, api, api_text_value, app_build, app_version, ' +
        'device_manufacturer, device_model, device_width_px, device_height_px, device_density, ' +
        'is_rooted, meta_data ' +
    'FROM public.chat_extra_android ';

var fnGetChatsExtra = function (flow, cb) {
    if (flow.chatIds.length === 0) {
        cb(null, flow);
    } else {
        var sql = preparedGetChatsExtra + ' WHERE chat_id IN(' + flow.chatIds.join(',') + ')';
        flow.client.query(sql, function (err, result) {
            if (err) {
                cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else {
                for (var i = 0; i < result.rows.length; i++) {
                    flow.chatsMap[result.rows[i].chat_id].extra = {
                        countryId: parseInt(result.rows[i].country_id),
                        langId: parseInt(result.rows[i].lang_id),
                        api: parseInt(result.rows[i].api),
                        apiTextValue: result.rows[i].api_text_value,
                        appBuild: parseInt(result.rows[i].app_build),
                        appVersion: result.rows[i].app_version,
                        deviceManufacturer: result.rows[i].device_manufacturer,
                        deviceModel: result.rows[i].device_model,
                        deviceWidthPx: parseInt(result.rows[i].device_width_px),
                        deviceHeightPx: parseInt(result.rows[i].device_height_px),
                        deviceDensity: parseInt(result.rows[i].device_density),
                        isRooted: result.rows[i].is_rooted,
                        metaData: result.rows[i].meta_data
                    };
                }
                cb(null, flow);
            }
        });
    }
};

var fnGetLastMessage = function (flow, cb) {
    try {
        api_chatsGetLastMessagePerChat(flow.env, {chatIds: flow.chatIds}, function (err, result) {
            if (err) {
                cb(err, flow);
            } else {
                for (var i = 0; i < flow.chatIds.length; i++) {
                    flow.chatsMap[flow.chatIds[i]].lastMessage = result[flow.chatIds[i]];
                }
                cb(null, flow);
            }
        });
    } catch(err) {
        cb(errBuilder(dErr.INTERNAL_ERROR, err.message), flow);
    }
};

var fnSortAndGenerateResult = function (flow, cb) {
    flow.result = [];
    for(var key in flow.chatsMap) {
        if(flow.chatsMap.hasOwnProperty(key)) {
            flow.result.push(flow.chatsMap[key]);
        }
    }

    flow.result = flow.result.sort(function(a, b) {
        return a.lastUpdate.getTime() - b.lastUpdate.getTime();
    });

    for (var i = 0; i < flow.result.length; i++) {
        delete flow.result[i].lastUpdate;
    }

    cb(null, flow);
};

var fnTasksFinishProcessor = function (next) {
    return function(errFlow, flow) {
        if (errFlow) {
            if (flow.client) {
                flow.clientDone();
            }
            next(errFlow);
        } else {
            flow.clientDone();
            next(null, flow.result);
        }
    };
};


module.exports = fnExecute;