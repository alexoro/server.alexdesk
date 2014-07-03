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


describe('DAL::serviceUserCreate', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserCreate(argsBuilder({id: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({id: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({id: -1}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({id: '-1'}), cb);
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
                    api.serviceUserCreate(argsBuilder({login: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({login: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({login: -1}), cb);
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
                    api.serviceUserCreate(argsBuilder({passwordHash: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({passwordHash: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({passwordHash: -1}), cb);
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
                    api.serviceUserCreate(argsBuilder({name: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({name: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({name: -1}), cb);
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
                    api.serviceUserCreate(argsBuilder({registered: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({registered: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({registered: -1}), cb);
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
                    api.serviceUserCreate(argsBuilder({lastVisit: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({lastVisit: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({lastVisit: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid isConfirmed', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserCreate(argsBuilder({isConfirmed: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({isConfirmed: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreate(argsBuilder({isConfirmed: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUserCreate(reqArgs, function (err, result) {
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
            api.serviceUserCreate(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    id: reqArgsCreate.id
                };
                api.serviceUserGetProfileById(reqArgsGet, function (err, profile) {
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