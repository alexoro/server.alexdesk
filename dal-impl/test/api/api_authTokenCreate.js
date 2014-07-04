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
        token: override.token === undefined ? 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' : override.token,
        userType: override.userType === undefined ? 1 : override.userType,
        userId: override.userId === undefined ? '1' : override.userId,
        expires: override.expires === undefined ? new Date('2020-01-01 00:00:00') : override.expires
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


describe('DAL::authTokenCreate', function () {

    it('Must not pass invalid token', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaZ'}), invalidArgsCallbackEntry(cb));
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
                    api.authTokenCreate(argsBuilder({userType: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userType: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userType: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.authTokenCreate(argsBuilder({userId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid expires', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.authTokenCreate(argsBuilder({expires: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({expires: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({expires: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.authTokenCreate(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return just created token', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsCreate = argsBuilder();
            api.authTokenCreate(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    token: reqArgsCreate.token
                };
                api.userGetInfoForToken(reqArgsGet, function (err, info) {
                    if (err) {
                        return doneExecute(err);
                    }
                    var expected = {
                        type: reqArgsCreate.userType,
                        id: reqArgsCreate.userId,
                        expires: reqArgsCreate.expires
                    };
                    assert.deepEqual(info, expected, 'Just created token was not found or not match w/ expected');
                    doneExecute();
                });
            });
        }, doneTest);
    });

});