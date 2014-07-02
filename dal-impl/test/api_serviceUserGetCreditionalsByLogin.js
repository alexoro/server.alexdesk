/**
 * Created by UAS on 12.06.2014.
 */

"use strict";


var assert = require('chai').assert;
var async = require('async');

var domain = require('../src/').domain;
var dErr = domain.errors;

var mock = require('./mock');


var argsBuilder = function(override) {
    if (!override) {
        override = {};
    }
    return {
        login: override.login === undefined ? 'test@test.com' : override.login
    };
};

var invalidArgsCallback = function (done) {
    return function (err) {
        if (err && err.type === dErr.INVALID_PARAMS) {
            done();
        } else if (err) {
            done(err);
        } else {
            done(new Error('Application was created with invalid param'));
        }
    };
};


describe('DAL::serviceUserGetCreditionalsByLogin', function () {

    it('Must not pass invalid login', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserGetCreditionalsByLogin(argsBuilder({login: {}}), cb);
                },
                function (cb) {
                    api.serviceUserGetCreditionalsByLogin(argsBuilder({login: null}), cb);
                },
                function (cb) {
                    api.serviceUserGetCreditionalsByLogin(argsBuilder({login: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
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