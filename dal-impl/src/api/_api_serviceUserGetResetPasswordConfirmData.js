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
        fnGetInfoByTokenAndGenerateResult
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


var preparedGetInfoByToken = 'SELECT service_user_id::text, expires FROM public.system_reset_password_confirm WHERE id = $1';

var fnGetInfoByTokenAndGenerateResult = function (flow, cb) {
    flow.client.query(preparedGetInfoByToken, [flow.args.token], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length > 1) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 rows is returned for token: ' + flow.args.token));
        } else if (result.rows.length === 0) {
            flow.result = null;
            cb(null, flow);
        } else {
            flow.result = {
                token: flow.args.token,
                userId: result.rows[0].service_user_id,
                expires: result.rows[0].expires
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