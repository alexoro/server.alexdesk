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
        fnSetAndGenerateResult
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

    if (flow.args.token === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'token is not defined'), flow);
    }
    if (!validate.guid4(flow.args.token)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect token value: ' + flow.args.token), flow);
    }

    if (flow.args.userId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'userId is not defined'), flow);
    }
    if (!validate.positiveBigInt(flow.args.userId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect userId value: ' + flow.args.userId), flow);
    }

    if (flow.args.expires === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'expires is not defined'), flow);
    }
    if (!validate.date(flow.args.expires)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect expires value: ' + flow.args.expires), flow);
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


var preparedSet = 'INSERT INTO public.system_register_confirm(id, service_user_id, expires) VALUES($1, $2, $3)';

var fnSetAndGenerateResult = function (flow, cb) {
    flow.client.query(preparedSet, [flow.args.token, flow.args.userId, flow.args.expires], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            flow.result = null;
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