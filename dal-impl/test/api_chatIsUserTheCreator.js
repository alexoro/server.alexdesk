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
        chatId: override.chatId === undefined ? '1' : override.chatId,
        userId: override.userId === undefined ? '2' : override.userId,
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


describe('DAL::chatIsUserTheCreator', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({chatId: {}}), cb);
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({chatId: null}), cb);
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({chatId: '-1'}), cb);
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({chatId: 1}), cb);
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
                    api.chatIsUserTheCreator(argsBuilder({userId: {}}), cb);
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userId: null}), cb);
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userId: '-1'}), cb);
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userId: 1}), cb);
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
                    api.chatIsUserTheCreator(argsBuilder({userType: {}}), cb);
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userType: null}), cb);
                },
                function (cb) {
                    api.chatIsUserTheCreator(argsBuilder({userType: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
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