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
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnDbConnect,
        fnSetNames,
        fnGetAndGenerateResult
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

    if (flow.args.messageIds === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'messageIds is not defined'), flow);
    }
    if (!(flow.args.messageIds instanceof Array)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'messageIds is not an array'), flow);
    }
    for (var i = 0; i < flow.args.messageIds.length; i++) {
        if (!validate.positiveBigInt(flow.args.messageIds[i])) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect messageIds value: ' + flow.args.messageIds[i]), flow);
        }
    }

    if (flow.args.userId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'userId is not defined'), flow);
    }
    if (!validate.positiveBigInt(flow.args.userId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect userId value: ' + flow.args.userId), flow);
    }

    if (flow.args.userType === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'userType is not defined'), flow);
    }
    if (!validate.positiveSmallInt(flow.args.userType)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect userType value: ' + flow.args.userType), flow);
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

var fnGetAndGenerateResult = function (flow, cb) {
    if (flow.args.messageIds.length === 0) {
        flow.result = {};
        cb(null, flow);
    } else {
        flow.result = {};
        var i;
        for (i = 0; i < flow.args.messageIds.length; i++) {
            flow.result[flow.args.messageIds[i]] = false;
        }

        var preparedGet = 'SELECT message_id::text, is_read ' +
            'FROM public.chat_messages_extra ' +
            'WHERE message_id IN('+ flow.args.messageIds.join(',') +') AND user_id = $1 AND user_type = $2';

        flow.client.query(preparedGet, [flow.args.userId, flow.args.userType], function (err, result) {
            if (err) {
                cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else {
                for (var i = 0; i < result.rows.length; i++) {
                    flow.result[result.rows[i].message_id] = result.rows[i].is_read;
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