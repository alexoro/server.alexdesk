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
                appPlatform: -1,
                inTransaction: false,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnDbConnect,
        fnSetNames,
        fnServiceUserCreateAndGenerateResult
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
    if (flow.args.login === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'login is not defined'), flow);
    }
    if (flow.args.passwordHash === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'passwordHash is not defined'), flow);
    }
    if (flow.args.name === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'name is not defined'), flow);
    }
    if (flow.args.registered === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'registered is not defined'), flow);
    }
    if (flow.args.lastVisit === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'lastVisit is not defined'), flow);
    }
    if (flow.args.isConfirmed === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'isConfirmed is not defined'), flow);
    }

    if (!validate.positiveBigInt(flow.args.id)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect id value: ' + flow.args.id), flow);
    }
    if (!validate.varchar(flow.args.login, 1, 100)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect login value: ' + flow.args.login), flow);
    }
    if (!validate.varchar(flow.args.passwordHash, 32, 32)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect passwordHash value: ' + flow.args.passwordHash), flow);
    }
    if (!validate.varchar(flow.args.name, 1, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect name value: ' + flow.args.name), flow);
    }
    if (!validate.date(flow.args.registered, 1, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect registered value: ' + flow.args.registered), flow);
    }
    if (!validate.date(flow.args.lastVisit, 1, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect lastVisit value: ' + flow.args.lastVisit), flow);
    }
    if (!validate.bool(flow.args.isConfirmed)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isConfirmed value: ' + flow.args.isConfirmed), flow);
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


var preparedServiceUserCreateAndGenerateResult =
    'INSERT INTO public.users (id, login, password_hash, name, registered, last_visit, is_confirmed) VALUES($1, $2, $3, $4, $5, $6, $7)';

var fnServiceUserCreateAndGenerateResult = function (flow, cb) {
    var args = [
        flow.args.id,
        flow.args.login,
        flow.args.passwordHash,
        flow.args.name,
        flow.args.registered,
        flow.args.lastVisit,
        flow.args.isConfirmed
    ];
    flow.client.query(preparedServiceUserCreateAndGenerateResult, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
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