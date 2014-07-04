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
            cb(new Error('Application was created with invalid param'));
        }
    };
};


describe('DAL::messagesSetIsReadInChatForUser', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({chatId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({chatId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({chatId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({chatId: 1}), invalidArgsCallbackEntry(cb));
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
                    api.messagesSetIsReadInChatForUser(argsBuilder({userType: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userType: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userType: '1'}), invalidArgsCallbackEntry(cb));
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
                    api.messagesSetIsReadInChatForUser(argsBuilder({userId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return error if chat not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatId: '1000'});
            api.messagesSetIsReadInChatForUser(reqArgs, function (err, result) {
                if (err && err.number === dErr.CHAT_NOT_FOUND) {
                    doneExecute();
                } else if (err) {
                    doneExecute(err);
                } else {
                    doneExecute(new Error('Method was executed successfully with non-existing chat'));
                }
            });
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.messagesSetIsReadInChatForUser(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});