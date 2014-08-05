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
        chatId: override.chatId === undefined ? '1' : override.chatId,
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


describe('DAL::messages_setIsReadInChatForUser', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({chatId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({chatId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({chatId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({chatId: 1}), invalidArgsCallbackEntry(cb));
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
                    api.messages_setIsReadInChatForUser(argsBuilder({userType: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({userType: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({userType: '1'}), invalidArgsCallbackEntry(cb));
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
                    api.messages_setIsReadInChatForUser(argsBuilder({userId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messages_setIsReadInChatForUser(argsBuilder({userId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.messages_setIsReadInChatForUser(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});