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
    if (flow.args.userId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'userId is not defined'), flow);
    }
    if (flow.args.userType === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'userType is not defined'), flow);
    }

    if (!validate.positiveBigInt(flow.args.chatId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect chatId value: ' + flow.args.chatId), flow);
    }
    if (!validate.positiveBigInt(flow.args.userId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect userId value: ' + flow.args.userId), flow);
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


var preparedGetResult = 'SELECT 1 FROM public.chats WHERE id = $1 AND user_creator_id = $2 AND user_creator_type = $3';

var fnGetResultAndGenerateResult = function (flow, cb) {
    var args = [
        flow.args.chatId,
        flow.args.userId,
        flow.args.userType
    ];
    flow.client.query(preparedGetResult, args, function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length > 1) {
            var errMessage = 'More than 1 rows is returned for chatId: ' + flow.args.chatId +
                ' and userId: ' + flow.args.userId +
                ' and userType: ' + flow.args.userType;
            cb(errBuilder(dErr.LOGIC_ERROR, errMessage));
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