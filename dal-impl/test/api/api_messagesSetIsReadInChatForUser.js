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


describe('DAL::messagesSetIsReadInChatForUser', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({chatId: {}}), cb);
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({chatId: null}), cb);
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({chatId: '-1'}), cb);
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({chatId: 1}), cb);
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
                    api.messagesSetIsReadInChatForUser(argsBuilder({userType: {}}), cb);
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userType: null}), cb);
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userType: '1'}), cb);
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
                    api.messagesSetIsReadInChatForUser(argsBuilder({userId: {}}), cb);
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userId: null}), cb);
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userId: '-1'}), cb);
                },
                function (cb) {
                    api.messagesSetIsReadInChatForUser(argsBuilder({userId: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
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