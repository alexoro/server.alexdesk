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
        fnGetResultAndGenerateResult
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

    if (flow.args.chatId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'chatId is not defined'), flow);
    }
    if (!validate.positiveBigInt(flow.args.chatId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect chatId value: ' + flow.args.chatId), flow);
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


var preparedGetResult = 'SELECT user_type, user_id::text FROM public.chat_participants WHERE chat_id = $1';

var fnGetResultAndGenerateResult = function (flow, cb) {
    flow.client.query(preparedGetResult, [flow.args.chatId], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            flow.result = [];
            for (var i = 0; i < result.rows.length; i++) {
                flow.result.push({
                    id: result.rows[i].user_id,
                    type: result.rows[i].user_type
                });
            }
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