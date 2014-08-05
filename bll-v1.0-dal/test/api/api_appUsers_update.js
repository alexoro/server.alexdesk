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
        id: override.id === undefined ? '2' : override.id,
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


describe('DAL::appUsers_update', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUsers_update(argsBuilder({id: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({id: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({id: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({id: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(argsBuilder({appId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({appId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({appId: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({appId: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(argsBuilder({login: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({login: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({login: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(argsBuilder({passwordHash: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({passwordHash: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({passwordHash: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(argsBuilder({name: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({name: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({name: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(argsBuilder({registered: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({registered: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({registered: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(argsBuilder({lastVisit: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({lastVisit: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({lastVisit: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = null;
                    api.appUsers_update(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = 'x';
                    api.appUsers_update(reqArgs, invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(argsBuilder({deviceUuid: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({deviceUuid: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({deviceUuid: -1}), invalidArgsCallbackEntry(cb));
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
                    api.appUsers_update(argsBuilder({gcmToken: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({gcmToken: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appUsers_update(argsBuilder({gcmToken: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appUsers_update(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

    it('Updated user must be equal to given', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsUpdate = argsBuilder();
            api.appUsers_update(reqArgsUpdate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGetProfileById = {
                    id: reqArgsUpdate.id
                };
                api.appUsers_getProfileById(reqArgsGetProfileById, function (err, profile) {
                    if (err) {
                        return doneExecute(err);
                    } else {
                        delete profile.platform;
                        assert.deepEqual(profile, reqArgsUpdate, 'Just updated user was not updated');
                        return doneExecute();
                    }
                });
            });
        }, doneTest);
    });

});