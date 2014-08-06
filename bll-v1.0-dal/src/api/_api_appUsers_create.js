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
        fnCreateAppUser,
        fnAppUserCreateExtra,
        fnTransactionCommit,
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
    if (flow.args.appId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'appId is not defined'), flow);
    }
    if (flow.args.login === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'login is not defined'), flow);
    }
    if (flow.args.passwordHash === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'passwordHash is not defined'), flow);
    }
    if (flow.args.name === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'name is not defined'), flow);
    }
    if (flow.args.registered === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'registered is not defined'), flow);
    }
    if (flow.args.lastVisit === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'lastVisit is not defined'), flow);
    }
    if (flow.args.extra === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'extra holder is not defined'), flow);
    }
    if (typeof flow.args.extra !== 'object' || flow.args.extra === null) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'extra holder is not a object'), flow);
    }
    if (flow.args.extra.deviceUuid === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'extra deviceUuid is not defined'), flow);
    }
    if (flow.args.extra.gcmToken === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'extra gcmToken is not defined'), flow);
    }

    if (!validate.positiveBigInt(flow.args.id)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect id value: ' + flow.args.id), flow);
    }
    if (!validate.positiveBigInt(flow.args.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect appId value: ' + flow.args.appId), flow);
    }
    if (!validate.varchar(flow.args.login, 1, 64)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect login value: ' + flow.args.login), flow);
    }
    if (!validate.varchar(flow.args.passwordHash, 32, 32)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect passwordHash value: ' + flow.args.passwordHash), flow);
    }
    if (!validate.varchar(flow.args.name, 1, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect name value: ' + flow.args.name), flow);
    }
    if (!validate.date(flow.args.registered, 1, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect registered value: ' + flow.args.registered), flow);
    }
    if (!validate.date(flow.args.lastVisit, 1, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect lastVisit value: ' + flow.args.lastVisit), flow);
    }
    if (!validate.varchar(flow.args.extra.deviceUuid, 0, 32)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra deviceUuid value: ' + flow.args.extra.deviceUuid), flow);
    }
    if (!validate.varchar(flow.args.extra.gcmToken, 0, 4196)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra gcmToken value: ' + flow.args.extra.gcmToken), flow);
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
    flow.client.query(preparedGetAppPlatform, [flow.args.appId], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length === 0) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'Application is not found. Given ID: #' + flow.args.appId), flow);
        } else if (result.rows.length > 1) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 application is found for ID #' + flow.args.appId), flow);
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


var preparedCreateAppUser =
    'INSERT INTO public.app_users(app_user_id, app_id, login, password_hash, name, registered, last_visit) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7)';

var fnCreateAppUser = function (flow, cb) {
    var args = [
        flow.args.id,
        flow.args.appId,
        flow.args.login,
        flow.args.passwordHash,
        flow.args.name,
        flow.args.registered,
        flow.args.lastVisit
    ];
    flow.client.query(preparedCreateAppUser, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            cb(null, flow);
        }
    });
};


var preparedAppUserCreateExtra = 'INSERT INTO public.app_users_extra_android (app_id, app_user_id, device_uuid, gcm_token) VALUES ($1, $2, $3, $4)';

var fnAppUserCreateExtra = function (flow, cb) {
    var args = [
        flow.args.appId,
        flow.args.id,
        flow.args.extra.deviceUuid,
        flow.args.extra.gcmToken
    ];
    flow.client.query(preparedAppUserCreateExtra, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            cb(null, flow);
        }
    });
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