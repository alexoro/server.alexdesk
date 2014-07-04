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
        userId: override.userId === undefined ? '2' : override.userId,
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
            cb(new Error('Application was created with invalid param'));
        }
    };
};


describe('DAL::chatIsUserTheCreator', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({chatId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({chatId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({chatId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({chatId: 1}), invalidArgsCallbackEntry(cb));
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
                    api.chatIsUserTheCreator(argsBuilder({userId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userId: 1}), invalidArgsCallbackEntry(cb));
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
                    api.chatIsUserTheCreator(argsBuilder({userType: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userType: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userType: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return true if creator', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chatIsUserTheCreator(reqArgs, function (err, isCreator) {
                if (err) {
                    return doneExecute(err);
                }
                assert.strictEqual(isCreator, true, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return false if not creator', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({userId: '1000'});
            api.chatIsUserTheCreator(reqArgs, function (err, isCreator) {
                if (err) {
                    return doneExecute(err);
                }
                assert.strictEqual(isCreator, false, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});