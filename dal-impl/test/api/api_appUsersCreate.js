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
        appId: override.appId === undefined ? '1' : override.appId,
        login: override.login === undefined ? 'testLogin' : override.login,
        passwordHash: override.passwordHash === undefined ? '93134919a8fd95a216c9109b60bc6070' : override.passwordHash,
        name: override.name === undefined ? 'testName' : override.name,
        registered: override.registered === undefined ? new Date('2014-01-01 00:00:00') : override.registered,
        lastVisit: override.lastVisit === undefined ? new Date('2014-01-01 00:00:00') : override.lastVisit,
        extra: {
            deviceUuid: override.deviceUuid === undefined ? 'd318027fea45c1900e257136c47ebfba' : override.deviceUuid,
            gcmToken: override.gcmToken === undefined ? '' : override.gcmToken
        }
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


describe.only('DAL::appUsersCreate', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUsersCreate(argsBuilder({id: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({id: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({id: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({id: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid appId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUsersCreate(argsBuilder({appId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({appId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({appId: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({appId: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.appUsersCreate(argsBuilder({login: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({login: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({login: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsersCreate(argsBuilder({passwordHash: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({passwordHash: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({passwordHash: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsersCreate(argsBuilder({name: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({name: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({name: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsersCreate(argsBuilder({registered: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({registered: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({registered: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsersCreate(argsBuilder({lastVisit: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({lastVisit: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({lastVisit: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid extra holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.extra;
                    api.appUsersCreate(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = null;
                    api.appUsersCreate(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = 'x';
                    api.appUsersCreate(reqArgs, invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid deviceUuid', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUsersCreate(argsBuilder({deviceUuid: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({deviceUuid: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({deviceUuid: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid gcmToken', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUsersCreate(argsBuilder({gcmToken: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({gcmToken: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsersCreate(argsBuilder({gcmToken: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appUsersCreate(reqArgs, function (err, result) {
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
            api.appUsersCreate(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    appId: argsBuilder().appId,
                    login: argsBuilder().login
                };
                api.appUserGetCreditionalsByLogin(reqArgsGet, function (err, credentials) {
                    if (err) {
                        return doneExecute(err);
                    } else {
                        assert.isNotNull(credentials, 'Just created user was not found');
                        return doneExecute();
                    }
                });
            });
        }, doneTest);
    });

});