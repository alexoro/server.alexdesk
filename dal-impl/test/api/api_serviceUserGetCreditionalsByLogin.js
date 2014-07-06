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
        login: override.login === undefined ? 'test@test.com' : override.login
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


describe('DAL::serviceUserGetCreditionalsByLogin', function () {

    it('Must not pass invalid login', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserGetCreditionalsByLogin(argsBuilder({login: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUserGetCreditionalsByLogin(argsBuilder({login: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUserGetCreditionalsByLogin(argsBuilder({login: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUserGetCreditionalsByLogin(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }

                var expected = {
                    id: '1',
                    login: 'test@test.com',
                    passwordHash: 'b642b4217b34b1e8d3bd915fc65c4452'
                };
                assert.deepEqual(result, expected, 'Expected and actual result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return null if login not found', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({login: 'XXXXXXX'});
            api.serviceUserGetCreditionalsByLogin(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result, 'Expected and actual result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});