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
            cb(new Error('Method was executed with invalid params'));
        }
    };
};


describe('DAL::serviceUsers_resetPasswordConfirmDataCreate', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({token: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({token: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({token: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({token: '0cec4d47-d9a1-4984-XXXX-10583b674123'}), invalidArgsCallbackEntry(cb));
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
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({userId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({userId: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({expires: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({expires: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_resetPasswordConfirmDataCreate(argsBuilder({expires: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUsers_resetPasswordConfirmDataCreate(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

    it('Created data must be accessible', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsCreate = argsBuilder();
            api.serviceUsers_resetPasswordConfirmDataCreate(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    token: reqArgsCreate.token
                };
                api.serviceUsers_resetPasswordConfirmDataGet(reqArgsGet, function (err, data) {
                    if (err) {
                        return doneExecute(err);
                    } else {
                        assert.isNotNull(data, 'Just created data was not found');
                        assert.deepEqual(data, reqArgsCreate, 'Expected result is not match w/ actual');
                        return doneExecute();
                    }
                });
            });
        }, doneTest);
    });

});