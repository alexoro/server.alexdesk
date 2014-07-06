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
        fnGetMainInfoAndGenerateResult,
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


var preparedGetMainInfo = 'SELECT id::text, login, password_hash, name, registered, last_visit, is_confirmed ' +
    'FROM public.users ' +
    'WHERE id = $1';

var fnGetMainInfoAndGenerateResult = function (flow, cb) {
    flow.client.query(preparedGetMainInfo, [flow.args.id], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length > 1) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 rows is found for user #' + flow.args.id), flow);
        } else if (result.rows.length === 0) {
            flow.result = null;
            cb(null, flow);
        } else {
            flow.result = {
                id: result.rows[0].id,
                login: result.rows[0].login,
                passwordHash: result.rows[0].password_hash,
                name: result.rows[0].name,
                registered: result.rows[0].registered,
                lastVisit: result.rows[0].last_visit,
                isConfirmed: result.rows[0].is_confirmed
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