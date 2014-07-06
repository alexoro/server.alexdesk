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
                appIds: [],
                appsMap: {},
                result: []
            };
            cb(null, flow);
        },
        fnValidate,
        fnDbConnect,
        fnGetAppsIdsForUser,
        fnGetAppsInfo,
        fnGetAppsExtraAndroid,
        fnGenerateResult
    ];

    async.waterfall(
        fnStack,
        fnTasksFinishProcessor(next)
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


var preparedGetAppsIdsForUser = 'SELECT app_id::text FROM app_acl WHERE user_id = $1';

var fnGetAppsIdsForUser = function (flow, cb) {
    var args = [
        flow.args.userId
    ];
    var query = flow.client.query(preparedGetAppsIdsForUser, args);
    query.on('error', function (err) {
        cb(errBuilder(dErr.DB_ERROR, err.message), flow);
    });
    query.on('row', function (row, result) {
        flow.appIds.push(row.app_id);
    });
    query.on('end', function (result) {
        cb(null, flow);
    });
};

var fnGetAppsInfo = function (flow, cb) {
    if (flow.appIds.length === 0) {
        return cb(null, flow);
    }

    var sql =
        'SELECT id::text, platform_type, title, created, is_approved, is_blocked, is_deleted ' +
        'FROM apps ' +
        'WHERE id IN (' + flow.appIds.join(',') + ')';
    var query = flow.client.query(sql);
    query.on('error', function (err) {
        cb(errBuilder(dErr.DB_ERROR, err.message), flow);
    });
    query.on('row', function (row, result) {
        var app = {
            id: row.id,
            platformType: row.platform_type,
            title: row.title,
            created: row.created,
            isApproved: row.is_approved,
            isBlocked: row.is_blocked,
            isDeleted: row.is_deleted,
            extra: {}
        };
        flow.appsMap[row.id] = app;
        flow.result.push(app);
    });
    query.on('end', function (result) {
        cb(null, flow);
    });
};

var fnGetAppsExtraAndroid = function (flow, cb) {
    if (flow.appIds.length === 0) {
        return cb(null, flow);
    }

    var androidAppsIds = [];
    for (var i = 0; i < flow.result.length; i++) {
        if (flow.result[i].platformType === domain.platforms.ANDROID) {
            androidAppsIds.push(flow.result[i].id);
        }
    }

    var sql =
        'SELECT app_id, package ' +
        'FROM app_info_extra_android ' +
        'WHERE app_id IN (' + androidAppsIds.join(',') + ')';
    flow.client.query(sql, function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            for (var i = 0; i < result.rows.length; i++) {
                if (!flow.appsMap[result.rows[i].app_id]) {
                    return  cb(errBuilder(dErr.DB_ERROR, 'Found extra for application that is not exists in apps. App id: ' + result.rows[i].app_id), flow);
                } else {
                    flow.appsMap[result.rows[i].app_id].extra.package = result.rows[i].package;
                }
            }
            cb(null, flow);
        }
    });
};


var fnGenerateResult = function (flow, cb) {
    cb(null, flow);
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