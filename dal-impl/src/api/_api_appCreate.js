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

    if (flow.args.id === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'id is not defined'));
    }
    if (flow.args.platform === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'platform is not defined'));
    }
    if (flow.args.title === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'title is not defined'));
    }
    if (flow.args.created === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'created is not defined'));
    }
    if (flow.args.isApproved === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'isApproved is not defined'));
    }
    if (flow.args.isBlocked === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'isBlocked is not defined'));
    }
    if (flow.args.isDeleted === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'isDeleted is not defined'));
    }
    if (flow.args.ownerUserId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'ownerUserId is not defined'));
    }
    if (flow.args.extra === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'extra is not defined'));
    }
    if (typeof flow.args.extra !== 'object') {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'extra is not a object'));
    }
    if (flow.args.extra.package === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'package is not defined'));
    }

    if (!validate.positiveBigInt(flow.args.id)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect id value: ' + flow.args.id));
    }
    if (!validate.positiveSmallInt(flow.args.platform)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect platform value: ' + flow.args.platform));
    }
    if (!validate.varchar(flow.args.title, 0, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect title value: ' + flow.args.title));
    }
    if (!validate.date(flow.args.created)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect created value: ' + flow.args.created));
    }
    if (!validate.bool(flow.args.isApproved)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isApproved value: ' + flow.args.isApproved));
    }
    if (!validate.bool(flow.args.isBlocked)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isBlocked value: ' + flow.args.isBlocked));
    }
    if (!validate.bool(flow.args.isDeleted)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isDeleted value: ' + flow.args.isDeleted));
    }
    if (!validate.positiveBigInt(flow.args.ownerUserId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect ownerUserId value: ' + flow.args.ownerUserId));
    }

    if (!validate.varchar(flow.args.extra.package, 0, 50)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra.package value: ' + flow.args.extra.package));
    }

    return cb(null, flow);
};

var fnGenerateResult = function (flow, cb) {
    flow.result = null;
//    cb(null, flow);
    cb(new Error('Not implemented'));
};


module.exports = fnExecute;