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

    if (flow.args.appIds === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'appIds is not defined'), flow);
    }
    if (!(flow.args.appIds instanceof Array)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'appIds is not an array'), flow);
    }

    for (var i = 0; i < flow.args.appIds.length; i++) {
        if (!validate.positiveBigInt(flow.args.appIds[i])) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect appId value: ' + flow.args.appIds[i]), flow);
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

var fnGetAndGenerateResult = function (flow, cb) {
    if (flow.args.appIds.length === 0) {
        flow.result = {};
        cb(null, flow);
    } else {
        var sql = 'SELECT app_id::text, COUNT(id) AS count ' +
            'FROM public.chat_messages ' +
            'WHERE app_id IN(' + flow.args.appIds.join(',') + ') ' +
            'GROUP BY app_id';
        flow.client.query(sql, function (err, result) {
            if (err) {
                cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else {
                flow.result = {};
                var i;
                for (i = 0; i < flow.args.appIds.length; i++) {
                    flow.result[flow.args.appIds[i]] = 0;
                }
                for (i = 0; i < result.rows.length; i++) {
                    flow.result[result.rows[i].app_id] = parseInt(result.rows[i].count);
                }
                cb(null, flow);
            }
        });
    }
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