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
        fnGetAndGenerateResult
    ];

    async.waterfall(
        fnStack,
        fnTasksFinishProcessor(next)
    );
};


var fnValidate = function (flow, cb) {
    if (!flow.args) {
        return cb(new Error('Args is not a defined'));
    }
    if (typeof flow.args !== 'object') {
        return cb(new Error('Args is not a object'));
    }

    if (flow.args.appId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'appId is not defined'), flow);
    }
    if (flow.args.login === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'login is not defined'), flow);
    }

    if (!validate.positiveBigInt(flow.args.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect appId value: ' + flow.args.appId), flow);
    }
    if (!validate.varchar(flow.args.login, 0, 64)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect login value: ' + flow.args.login), flow);
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

var preparedGet = 'SELECT app_user_id::text, password_hash FROM public.app_users WHERE app_id = $1 AND login = $2';

var fnGetAndGenerateResult = function (flow, cb) {
    flow.client.query(preparedGet, [flow.args.appId, flow.args.login], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length > 1) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 rows is found for appUser "' + flow.args.login + '" and app_id #' + flow.args.appId), flow);
        } else if (result.rows.length === 0) {
            flow.result = null;
            cb(null, flow);
        } else {
            flow.result = {
                id: result.rows[0].app_user_id,
                login: flow.args.login,
                passwordHash: result.rows[0].password_hash
            };
            cb(null, flow);
        }
    });
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