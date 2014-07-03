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

var invalidArgsCallback = function (done) {
    return function (err) {
        if (err && err.number === dErr.INVALID_PARAMS) {
            done();
        } else if (err) {
            done(err);
        } else {
            done(new Error('Application was created with invalid param'));
        }
    };
};


describe('DAL::appUserUpdate', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({id: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({id: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({id: -1}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({id: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid appId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({appId: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({appId: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({appId: -1}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({appId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid login', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({login: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({login: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({login: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid passwordHash', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({passwordHash: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({passwordHash: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({passwordHash: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid name', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({name: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({name: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({name: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid registered', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({registered: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({registered: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({registered: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid lastVisit', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({lastVisit: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({lastVisit: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({lastVisit: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid extra holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.extra;
                    api.appUserUpdate(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = null;
                    api.appUserUpdate(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = 'x';
                    api.appUserUpdate(reqArgs, cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid deviceUuid', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({deviceUuid: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({deviceUuid: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({deviceUuid: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid gcmToken', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserUpdate(argsBuilder({gcmToken: {}}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({gcmToken: null}), cb);
                },
                function (cb) {
                    api.appUserUpdate(argsBuilder({gcmToken: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appUserUpdate(reqArgs, function (err, result) {
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
            api.appUserUpdate(reqArgsUpdate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGetProfileById = {
                    id: reqArgsUpdate.id
                };
                api.appUsersGetProfileById(reqArgsGetProfileById, function (err, profile) {
                    if (err) {
                        return doneExecute(err);
                    } else {
                        assert.deepEqual(profile, reqArgsUpdate, 'Just updated user was not updated');
                        return doneExecute();
                    }
                });
            });
        }, doneTest);
    });

});