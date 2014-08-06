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
        fnGetMessagesAndGenerateResult
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


var preparedGetMessagesPositiveOffset =
    'SELECT id::text, user_creator_id::text, user_creator_type, created, content ' +
    'FROM public.chat_messages ' +
    'WHERE chat_id = $1 ' +
    'ORDER BY created ASC ' +
    'LIMIT $2 OFFSET $3';
var preparedGetMessagesNegativeOffset =
    'SELECT id::text, user_creator_id::text, user_creator_type, created, content ' +
    'FROM public.chat_messages ' +
    'WHERE chat_id = $1 ' +
    'ORDER BY created DESC ' + // change of ASC to DESC
    'LIMIT $2 OFFSET $3';

var fnGetMessagesAndGenerateResult = function (flow, cb) {
    var query;
    var args;
    if (flow.args.offset >= 0) {
        query = preparedGetMessagesPositiveOffset;
        args = [
            flow.args.chatId,
            flow.args.limit,
            flow.args.offset
        ];
    } else {
        query = preparedGetMessagesNegativeOffset;
        args = [
            flow.args.chatId,
            -flow.args.offset > flow.args.limit ? flow.args.limit : -flow.args.offset,
            Math.max(0, -flow.args.offset - flow.args.limit)
        ];
    }

    flow.client.query(query, args, function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            flow.result = [];
            for (var i = 0; i < result.rows.length; i++) {
                var index = (flow.args.offset >= 0) ? i : result.rows.length - 1 - i;
                flow.result.push({
                    id: result.rows[index].id,
                    chatId: flow.args.chatId,
                    userCreatorId: result.rows[index].user_creator_id,
                    userCreatorType: result.rows[index].user_creator_type,
                    created: result.rows[index].created,
                    content: result.rows[index].content
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