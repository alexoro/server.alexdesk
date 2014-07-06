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
        fnGetResultAndGenerateResult
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
    if (!validate.positiveBigInt(flow.args.appId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect appId value: ' + flow.args.appId), flow);
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


var preparedGetResult = 'SELECT 1 FROM public.apps WHERE id = $1';

var fnGetResultAndGenerateResult = function (flow, cb) {
    flow.client.query(preparedGetResult, [flow.args.appId], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length > 1) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 rows is returned for appId: ' + flow.args.appId));
        } else if (result.rows.length === 0) {
            flow.result = false;
            cb(null, flow);
        } else {
            flow.result = true;
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