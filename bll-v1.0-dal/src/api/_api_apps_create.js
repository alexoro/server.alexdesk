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
                inTransaction: false,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnDbConnect,
        fnSetNames,
        fnTransactionBegin,
        fnCreateApp,
        fnCreateAppOwner,
        fnCreateAppExtra,
        fnTransactionCommit,
        fnGenerateResult
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
    if (flow.args.platform === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'platform is not defined'), flow);
    }
    if (flow.args.title === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'title is not defined'), flow);
    }
    if (flow.args.created === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'created is not defined'), flow);
    }
    if (flow.args.isApproved === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'isApproved is not defined'), flow);
    }
    if (flow.args.isBlocked === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'isBlocked is not defined'), flow);
    }
    if (flow.args.isDeleted === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'isDeleted is not defined'), flow);
    }
    if (flow.args.ownerUserId === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'ownerUserId is not defined'), flow);
    }
    if (flow.args.extra === undefined || !flow.args.extra) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'extra is not defined'), flow);
    }
    if (typeof flow.args.extra !== 'object') {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'extra is not a object'), flow);
    }
    if (flow.args.extra.package === undefined) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'package is not defined'), flow);
    }

    if (!validate.positiveBigInt(flow.args.id)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect id value: ' + flow.args.id), flow);
    }
    if (!validate.positiveSmallInt(flow.args.platform)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect platform value: ' + flow.args.platform), flow);
    }
    if (!validate.varchar(flow.args.title, 0, 40)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect title value: ' + flow.args.title), flow);
    }
    if (!validate.date(flow.args.created)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect created value: ' + flow.args.created), flow);
    }
    if (!validate.bool(flow.args.isApproved)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isApproved value: ' + flow.args.isApproved), flow);
    }
    if (!validate.bool(flow.args.isBlocked)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isBlocked value: ' + flow.args.isBlocked), flow);
    }
    if (!validate.bool(flow.args.isDeleted)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isDeleted value: ' + flow.args.isDeleted), flow);
    }
    if (!validate.positiveBigInt(flow.args.ownerUserId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect ownerUserId value: ' + flow.args.ownerUserId), flow);
    }

    if (!validate.varchar(flow.args.extra.package, 0, 50)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect extra.package value: ' + flow.args.extra.package), flow);
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


var fnTransactionBegin = function (flow, cb) {
    flow.client.query('BEGIN', function (err) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            flow.inTransaction = true;
            cb(null, flow);
        }
    });
};


var preparedCreateApp =
    'INSERT INTO public.apps(id, platform_type, title, created, is_approved, is_blocked, is_deleted) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7)';

var fnCreateApp = function (flow, cb) {
    var args = [
        flow.args.id,
        flow.args.platform,
        flow.args.title,
        flow.args.created,
        flow.args.isApproved,
        flow.args.isBlocked,
        flow.args.isDeleted
    ];
    flow.client.query(preparedCreateApp, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            cb(null, flow);
        }
    });
};


var preparedCreateAppAcl = 'INSERT INTO public.app_acl (app_id, user_id, is_owner) VALUES ($1, $2, $3)';

var fnCreateAppOwner = function (flow, cb) {
    var args = [
        flow.args.id,
        flow.args.ownerUserId,
        true
    ];
    flow.client.query(preparedCreateAppAcl, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            cb(null, flow);
        }
    });
};


var preparedCreateAppExtraAndroid = 'INSERT INTO public.app_info_extra_android(app_id, package) VALUES ($1, $2)';

var fnCreateAppExtra = function (flow, cb) {
    if (flow.args.platform === domain.platforms.ANDROID) {
        var args = [
            flow.args.id,
            flow.args.extra.package
        ];
        flow.client.query(preparedCreateAppExtraAndroid, args, function (err) {
            if (err) {
                return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else {
                cb(null, flow);
            }
        });
    } else {
        cb(errBuilder(dErr.LOGIC_ERROR, 'Unsupported platform type is specified: ' + flow.args.platform), flow);
    }
};

var fnTransactionCommit = function (flow, cb) {
    flow.client.query('COMMIT', function (err) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            flow.inTransaction = false;
            cb(null, flow);
        }
    });
};

var fnGenerateResult = function (flow, cb) {
    flow.result = null;
    cb(null, flow);
};

var fnTasksFinishProcessor = function (next) {
    return function(errFlow, flow) {
        if (errFlow) {
            if (flow.client) {
                if (flow.inTransaction) {
                    flow.client.query('ROLLBACK', function (errRollback) {
                        flow.clientDone();
                        next(errRollback || errFlow);
                    });
                } else {
                    flow.clientDone();
                    next(errFlow);
                }
            } else {
                next(errFlow);
            }
        } else {
            flow.clientDone();
            next(null, flow.result);
        }
    };
};


module.exports = fnExecute;