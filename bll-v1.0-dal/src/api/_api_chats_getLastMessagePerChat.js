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

    if (flow.args.chatIds === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'chatIds is not defined'), flow);
    }
    if (!(flow.args.chatIds instanceof Array)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'chatIds is not an array'), flow);
    }

    for (var i = 0; i < flow.args.chatIds.length; i++) {
        if (!validate.positiveBigInt(flow.args.chatIds[i])) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect chatIds value: ' + flow.args.chatIds[i]), flow);
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

var fnSetNames = function (flow, cb) {
    flow.client.query("SET NAMES 'UTF8'", function (err) {
        cb(err, flow);
    });
};


var preparedGetLastMessageForChat = 'SELECT id::text, chat_id::text, user_creator_id::text, user_creator_type, created, content ' +
    'FROM public.chat_messages ' +
    'WHERE chat_id = $1 ' +
    'ORDER BY created DESC ' +
    'LIMIT 1';

var fnGetAndGenerateResult = function (flow, cb) {
    if (flow.args.chatIds.length === 0) {
        flow.result = {};
        cb(null, flow);
    } else {
        flow.result = {};
        var i;
        for (i = 0; i < flow.args.chatIds.length; i++) {
            flow.result[flow.args.chatIds[i]] = null;
        }

        var fnStack = [];
        for (i = 0; i < flow.args.chatIds.length; i++) {
            (function (e) {
                fnStack.push(function (cbInnerStack) {
                    flow.client.query(preparedGetLastMessageForChat, [e], function (err, innerResult) {
                        if (err) {
                            cbInnerStack(err);
                        } else if (innerResult.rows.length === 0) {
                            flow.result[e] = null;
                            cbInnerStack(null);
                        } else {
                            flow.result[e] = {
                                id: innerResult.rows[0].id,
                                chatId: innerResult.rows[0].chat_id,
                                userCreatorId: innerResult.rows[0].user_creator_id,
                                userCreatorType: parseInt(innerResult.rows[0].user_creator_type),
                                created: innerResult.rows[0].created,
                                content: innerResult.rows[0].content
                            };
                            cbInnerStack(null);
                        }
                    });
                });
            })(flow.args.chatIds[i]);
        }

        async.series(
            fnStack,
            function (err) {
                if (err) {
                    cb(errBuilder(dErr.DB_ERROR, err.message), flow);
                } else {
                    cb(null, flow);
                }
            }
        );
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