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
        chatIds: override.chatIds === undefined ? ['3'] : override.chatIds,
        userId: override.userId === undefined ? '3' : override.userId,
        userType: override.userType === undefined ? 2 : override.userType
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


describe('DAL::chatsGetNumberOfUnreadMessagesPerChatForUser', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({chatIds: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({chatIds: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({chatIds: ['-1']}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({chatIds: [1]}), invalidArgsCallbackEntry(cb));
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
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userId: 1}), invalidArgsCallbackEntry(cb));
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
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userType: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userType: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userType: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return 0 if chat is not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatIds: ['1000']});
            api.chatsGetNumberOfUnreadMessagesPerChatForUser(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.lengthOf(Object.keys(result), 1, 'Expected to receive 1 result');
                assert.isDefined(result['1000'], 'Expected to hold result in response');
                assert.strictEqual(result['1000'], 0, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result for app user #2', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({
                chatIds: ['1', '2'],
                userId: '2',
                userType: 2
            });
            api.chatsGetNumberOfUnreadMessagesPerChatForUser(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.lengthOf(Object.keys(result), 2, 'Expected to receive 2 results');
                assert.isDefined(result['1'], 'Expected to hold result in response');
                assert.isDefined(result['2'], 'Expected to hold result in response');
                assert.strictEqual(result['1'], 0, 'Expected and received result are not match');
                assert.strictEqual(result['2'], 0, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result for app user #3', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chatsGetNumberOfUnreadMessagesPerChatForUser(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.lengthOf(Object.keys(result), 1, 'Expected to receive 1 result');
                assert.isDefined(result['3'], 'Expected to hold result in response');
                assert.strictEqual(result['3'], 1, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result for service user #1', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({
                chatIds: ['1', '2'],
                userId: '1',
                userType: 1
            });
            api.chatsGetNumberOfUnreadMessagesPerChatForUser(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.lengthOf(Object.keys(result), 2, 'Expected to receive 2 results');
                assert.isDefined(result['1'], 'Expected to hold result in response');
                assert.isDefined(result['2'], 'Expected to hold result in response');
                assert.strictEqual(result['1'], 0, 'Expected and received result are not match');
                assert.strictEqual(result['2'], 1, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});