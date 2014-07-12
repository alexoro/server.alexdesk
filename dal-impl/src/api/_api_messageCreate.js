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
                appId: -1,
                inTransaction: false,
                result: null
            };
            cb(null, flow);
        },
        fnValidate,
        fnDbConnect,
        fnGetAppId,
        fnTransactionBegin,
        fnCreateMessage,
        fnCreateMessageExtra,
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

    if (!validate.positiveBigInt(flow.args.id)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect id value: ' + flow.args.id), flow);
    }
    if (!validate.positiveBigInt(flow.args.chatId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect chatId value: ' + flow.args.chatId), flow);
    }
    if (!validate.positiveBigInt(flow.args.userCreatorId)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect userCreatorId value: ' + flow.args.userCreatorId), flow);
    }
    if (!validate.positiveSmallInt(flow.args.userCreatorType)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect userCreatorType value: ' + flow.args.userCreatorType), flow);
    }
    if (!validate.date(flow.args.created)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect created value: ' + flow.args.created), flow);
    }
    if (!validate.varchar(flow.args.content, 0, 4096)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect content value: ' + flow.args.content), flow);
    }
    if (!(flow.args.isRead instanceof Array)) {
        return cb(errBuilder(dErr.INVALID_PARAMS, 'isRead is not an Array'), flow);
    }
    for (var i = 0; i < flow.args.isRead.length; i++) {
        if (typeof flow.args.isRead[i] !== 'object' || flow.args.isRead[i] === null) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isRead['+i+'] value: ' + flow.args.isRead[i]), flow);
        }
        if (!validate.positiveBigInt(flow.args.isRead[i].userId)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isRead['+i+'].userId value: ' + flow.args.isRead[i].userId), flow);
        }
        if (!validate.positiveSmallInt(flow.args.isRead[i].userType)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isRead['+i+'].userType value: ' + flow.args.isRead[i].userType), flow);
        }
        if (!validate.bool(flow.args.isRead[i].isRead)) {
            return cb(errBuilder(dErr.INVALID_PARAMS, 'Incorrect isRead['+i+'].isRead value: ' + flow.args.isRead[i].isRead), flow);
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


var preparedGetAppId = 'SELECT app_id::text FROM public.chats WHERE id = $1';

var fnGetAppId = function (flow, cb) {
    flow.client.query(preparedGetAppId, [flow.args.chatId], function (err, result) {
        if (err) {
            cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else if (result.rows.length === 0) {
            cb(errBuilder(dErr.CHAT_NOT_FOUND, 'Chat is not found. Given ID: #' + flow.args.chatId), flow);
        } else if (result.rows.length > 1) {
            cb(errBuilder(dErr.LOGIC_ERROR, 'More than 1 chat is found for ID #' + flow.args.chatId), flow);
        } else {
            flow.appId = result.rows[0].app_id;
            cb(null, flow);
        }
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


var preparedCreateMessage =
    'INSERT INTO public.chat_messages (id, app_id, chat_id, user_creator_id, user_creator_type, created, content) ' +
    'VALUES($1, $2, $3, $4, $5, $6, $7)';

var fnCreateMessage = function (flow, cb) {
    var args = [
        flow.args.id,
        flow.appId,
        flow.args.chatId,
        flow.args.userCreatorId,
        flow.args.userCreatorType,
        flow.args.created,
        flow.args.content
    ];
    flow.client.query(preparedCreateMessage, args, function (err) {
        if (err) {
            return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
        } else {
            cb(null, flow);
        }
    });
};


var preparedCreateMessageExtra =
    'INSERT INTO public.chat_messages_extra (app_id, chat_id, message_id, user_id, user_type, is_read) ' +
    'VALUES($1, $2, $3, $4, $5, $6)';

var fnCreateMessageExtra = function (flow, cb) {
    var fnStack = [];
    for (var i = 0; i < flow.args.isRead.length; i++) {
        var args = [
            flow.appId,
            flow.args.chatId,
            flow.args.id,
            flow.args.isRead[i].userId,
            flow.args.isRead[i].userType,
            flow.args.isRead[i].isRead
        ];
        (function (argsInner) {
            fnStack.push(function (cbInner) {
                flow.client.query(preparedCreateMessageExtra, argsInner, function (err) {
                    if (err) {
                        return cbInner(err);
                    } else {
                        cbInner(null, flow);
                    }
                });
            });
        })(args);
    }

    async.series(
        fnStack,
        function (err) {
            if (err) {
                return cb(errBuilder(dErr.DB_ERROR, err.message), flow);
            } else {
                cb(null, flow);
            }
        }
    );
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