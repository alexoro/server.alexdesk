/**
 * Created by UAS on 10.06.2014.
 */

"use strict";


var async = require('async');

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
        fnGenerateResult
    ];

    async.waterfall(
        fnStack,
        function(err, flow) {
            if (err) {
                next(err);
            } else {
                next(null, flow.result);
            }
        }
    );
};


var fnValidate = function (flow, cb) {
    if (!flow.args) {
        return cb(new Error('Args is not a defined'));
    }
    if (typeof flow.args !== 'object') {
        return cb(new Error('Args is not a object'));
    }

    if (flow.args.userId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'userId is not defined'), flow);
    }
    if (!validate.positiveBigInt(flow.args.userId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect userId value: ' + flow.args.userId), flow);
    }

    return cb(null, flow);
};

var fnGenerateResult = function (flow, cb) {
    flow.result = null;
//    cb(null, flow);
    cb(new Error('Not implemented'));
};


module.exports = fnExecute;