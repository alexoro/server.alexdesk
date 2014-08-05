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
        id: override.id === undefined ? '1000' : override.id,
        login: override.login === undefined ? 'testLogin' : override.login,
        passwordHash: override.passwordHash === undefined ? '93134919a8fd95a216c9109b60bc6070' : override.passwordHash,
        name: override.name === undefined ? 'testName' : override.name,
        registered: override.registered === undefined ? new Date('2014-01-01 00:00:00') : override.registered,
        lastVisit: override.lastVisit === undefined ? new Date('2014-01-01 00:00:00') : override.lastVisit,
        isConfirmed: override.isConfirmed === undefined ? false : override.isConfirmed
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


describe('DAL::serviceUsers_create', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_create(argsBuilder({id: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({id: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({id: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({id: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid login', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_create(argsBuilder({login: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({login: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({login: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid passwordHash', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_create(argsBuilder({passwordHash: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({passwordHash: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({passwordHash: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid name', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_create(argsBuilder({name: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({name: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({name: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid registered', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_create(argsBuilder({registered: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({registered: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({registered: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid lastVisit', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_create(argsBuilder({lastVisit: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({lastVisit: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({lastVisit: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid isConfirmed', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_create(argsBuilder({isConfirmed: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({isConfirmed: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_create(argsBuilder({isConfirmed: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUsers_create(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

    it('Created user must be accessible', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsCreate = argsBuilder();
            api.serviceUsers_create(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    id: reqArgsCreate.id
                };
                api.serviceUsers_getProfileById(reqArgsGet, function (err, profile) {
                    if (err) {
                        return doneExecute(err);
                    } else {
                        assert.deepEqual(profile, reqArgsCreate, 'Just created user was not found or not match w/ expected value');
                        return doneExecute();
                    }
                });
            });
        }, doneTest);
    });

});