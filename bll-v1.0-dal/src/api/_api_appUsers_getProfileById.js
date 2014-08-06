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
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnDbConnect,
        fnSetNames,
        fnGetMainInfo,
        fnGetAppPlatform,
        fnGetAppUserExtra,
        fnGenerateResult
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

    if (flow.args.id === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'id is not defined'), flow);
    }
    if (!validate.positiveBigInt(flow.args.id)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect id value: ' + flow.args.id), flow);
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


var preparedGetMainInfo = 'SELECT app_user_id::text, app_id::text, login, password_hash, name, registered, last_visit ' +
    'FROM public.app_users ' +
    'WHERE app_user_id = $1';

var fnGetMainInfo = function (flow, cb) {
    flow.client.query(preparedGetMainInfo, [flow.args.id], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length > 1) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 rows is found for appUser #' + flow.args.id), flow);
        } else if (result.rows.length === 0) {
            flow.result = null;
            cb(null, flow);
        } else {
            flow.result = {
                id: result.rows[0].app_user_id,
                appId: result.rows[0].app_id,
                login: result.rows[0].login,
                passwordHash: result.rows[0].password_hash,
                name: result.rows[0].name,
                registered: result.rows[0].registered,
                lastVisit: result.rows[0].last_visit,
                platform: -1,
                extra: {}
            };
            cb(null, flow);
        }
    });
};


var preparedGetAppPlatform = 'SELECT platform_type FROM public.apps WHERE id = $1';

var fnGetAppPlatform = function (flow, cb) {
    if (flow.result === null) {
        cb(null, flow);
    } else {
        flow.client.query(preparedGetAppPlatform, [flow.result.appId], function (err, result) {
            if (err) {
                cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else if (result.rows.length > 1) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 rows is found for application #' + flow.result.appId), flow);
            } else if (result.rows.length === 0) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'User is linked to application #' + flow.result.appId + ' but it was not found'), flow);
            } else {
                flow.result.platform = parseInt(result.rows[0].platform_type);
                cb(null, flow);
            }
        });
    }
};


var preparedGetAppUserExtra = 'SELECT device_uuid, gcm_token FROM public.app_users_extra_android WHERE app_user_id = $1';

var fnGetAppUserExtra = function (flow, cb) {
    if (flow.result === null) {
        cb(null, flow);
    } else if (flow.result.platform !== domain.platforms.ANDROID) {
        cb(errBuilder(dErr.LOGIC_ERROR, 'User on unsupported platform #' + flow.result.platform), flow);
    } else {
        flow.client.query(preparedGetAppUserExtra, [flow.result.id], function (err, result) {
            if (err) {
                cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else if (result.rows.length > 1) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'More than extra is found for app user #' + flow.result.id), flow);
            } else if (result.rows.length === 0) {
                cb(errBuilder(dErr.LOGIC_ERROR, 'App User extra is not found. User id: ' + flow.result.id), flow);
            } else {
                flow.result.extra.deviceUuid = result.rows[0].device_uuid;
                flow.result.extra.gcmToken = result.rows[0].gcm_token;
                cb(null, flow);
            }
        });
    }
};

var fnGenerateResult = function (flow, cb) {
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