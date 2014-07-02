/**
 * Created by UAS on 12.06.2014.
 */

"use strict";


var assert = require('chai').assert;
var async = require('async');

var domain = require('../src/').domain;
var dErr = domain.errors;

var mock = require('./mock');


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

var invalidArgsCallback = function (done) {
    return function (err) {
        if (err && err.type === dErr.INVALID_PARAMS) {
            done();
        } else if (err) {
            done(err);
        } else {
            done(new Error('Application was created with invalid param'));
        }
    };
};


describe('DAL::chatsGetNumberOfUnreadMessagesPerChatForUser', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({chatIds: {}}), cb);
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({chatIds: null}), cb);
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({chatIds: ['-1']}), cb);
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({chatIds: [1]}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userId: {}}), cb);
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userId: null}), cb);
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userId: '-1'}), cb);
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userId: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid userType', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userType: {}}), cb);
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userType: null}), cb);
                },
                function (cb) {
                    api.chatsGetNumberOfUnreadMessagesPerChatForUser(argsBuilder({userType: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return error if chat is not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatIds: ['1000']});
            api.chatsGetNumberOfUnreadMessagesPerChatForUser(reqArgs, function (err, result) {
                if (err && err.number === dErr.CHAT_NOT_FOUND) {
                    doneExecute();
                } else if (err) {
                    doneExecute(err);
                } else {
                    doneExecute(new Error('The result was returned for non-existing chat'));
                }
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
                assert.lengthOf(Object.keys(result).length, 2, 'Expected to receive 2 results');
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
                assert.lengthOf(Object.keys(result).length, 1, 'Expected to receive 1 result');
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
                assert.lengthOf(Object.keys(result).length, 2, 'Expected to receive 2 results');
                assert.isDefined(result['1'], 'Expected to hold result in response');
                assert.isDefined(result['2'], 'Expected to hold result in response');
                assert.strictEqual(result['1'], 0, 'Expected and received result are not match');
                assert.strictEqual(result['2'], 1, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});