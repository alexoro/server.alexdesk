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
        appId: override.appId === undefined ? '1' : override.appId,
        login: override.login === undefined ? 'test1' : override.login
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


describe('DAL::appUserGetCreditionalsByLogin', function () {

    it('Must not pass invalid appId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserGetCreditionalsByLogin(argsBuilder({appId: {}}), cb);
                },
                function (cb) {
                    api.appUserGetCreditionalsByLogin(argsBuilder({appId: null}), cb);
                },
                function (cb) {
                    api.appUserGetCreditionalsByLogin(argsBuilder({appId: -1}), cb);
                },
                function (cb) {
                    api.appUserGetCreditionalsByLogin(argsBuilder({appId: '-1'}), cb);
                },
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid login', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUserGetCreditionalsByLogin(argsBuilder({login: {}}), cb);
                },
                function (cb) {
                    api.appUserGetCreditionalsByLogin(argsBuilder({login: null}), cb);
                },
                function (cb) {
                    api.appUserGetCreditionalsByLogin(argsBuilder({login: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appUserGetCreditionalsByLogin(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                var expected = {
                    id: 2,
                    login: 'test1',
                    passwordHash: '5a105e8b9d40e1329780d62ea2265d8a'
                };
                assert.deepEqual(result, expected, 'Expected and received results are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return null if user is not found', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            reqArgs.login = 'xxxxxxxxx';
            api.appUserGetCreditionalsByLogin(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result, 'If user not exists, than null must be returned');
                doneExecute();
            });
        }, doneTest);
    });

});