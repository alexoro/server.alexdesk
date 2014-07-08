/**
 * Created by UAS on 12.06.2014.
 */

"use strict";


var assert = require('chai').assert;
var async = require('async');

var domain = require('../../src/index').domain;
var dErr = domain.errors;

var mock = require('./../mock/index');


var argsBuilder = function(override) {
    if (!override) {
        override = {};
    }
    return {
        messageIds: override.messageIds === undefined ? ['5', '6'] : override.messageIds,
        userType: override.userType === undefined ? 1 : override.userType,
        userId: override.userId === undefined ? '1' : override.userId
    };
};

var invalidArgsCallbackEntry = function (cb) {
    return function (err) {
        if (err && err.number === dErr.INVALID_PARAMS) {
            cb();
        } else if (err) {
            cb(err);
        } else {
            cb(new Error('Method was executed with invalid params'));
        }
    };
};


describe('DAL::messagesGetIsReadPerMessageForUser', function () {

    it('Must not pass invalid messageIds', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({messageIds: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({messageIds: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({messageIds: ['-1']}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({messageIds: [1]}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid userType', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({userType: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({userType: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({userType: '1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({userId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetIsReadPerMessageForUser(argsBuilder({userId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.messagesGetIsReadPerMessageForUser(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }

                assert.lengthOf(Object.keys(result), 2, 'Expected to receive 2 results');
                assert.isDefined(result['5'], 'Expected and received result are not match');
                assert.isDefined(result['6'], 'Expected and received result are not match');
                assert.strictEqual(result['5'], true, 'Expected and received result are not match');
                assert.strictEqual(result['6'], false, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return false for non-existingmessage', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({messageIds: ['1000']});
            api.messagesGetIsReadPerMessageForUser(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }

                assert.lengthOf(Object.keys(result), 1, 'Expected to receive 1 result');
                assert.isDefined(result['1000'], 'Expected and received result are not match');
                assert.strictEqual(result['1000'], false, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});