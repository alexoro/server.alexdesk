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
        token: override.token === undefined ? '142b2b49-75f2-456f-9533-435bd0ef94c0' : override.token
    };
};

var invalidArgsCallbackEntry = function (cb) {
    return function (err) {
        if (err && err.number === dErr.INVALID_PARAMS) {
            cb();
        } else if (err) {
            cb(err);
        } else {
            cb(new Error('Application was created with invalid param'));
        }
    };
};


describe('DAL::userGetInfoForToken', function () {

    it('Must not pass invalid token', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.userGetInfoForToken(argsBuilder({token: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.userGetInfoForToken(argsBuilder({token: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.userGetInfoForToken(argsBuilder({token: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.userGetInfoForToken(argsBuilder({token: '0cec4d47-d9a1-4984-XXXX-10583b674123'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.userGetInfoForToken(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                var expected = {
                    type: 1,
                    id: '1',
                    expires: new Date('2020-01-01 00:00:00')
                };
                assert.deepEqual(result, expected, 'Expected and actual values are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return null for non-existing token', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({confirmToken: '00ec4d47-d9a1-4984-8f23-10583b674123'});
            api.userGetInfoForToken(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result, 'Expected and actual values are not match');
                doneExecute();
            });
        }, doneTest);
    });

});