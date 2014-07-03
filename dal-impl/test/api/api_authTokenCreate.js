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


describe('DAL::authTokenCreate', function () {

    it('Must not pass invalid token', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: {}}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: null}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: -1}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: '-1'}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({token: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaZ'}), cb);
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
                    api.authTokenCreate(argsBuilder({userType: {}}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userType: null}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userType: '-1'}), cb);
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
                    api.authTokenCreate(argsBuilder({userId: {}}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userId: null}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userId: '-1'}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({userId: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid expires', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.authTokenCreate(argsBuilder({expires: {}}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({expires: null}), cb);
                },
                function (cb) {
                    api.authTokenCreate(argsBuilder({expires: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
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