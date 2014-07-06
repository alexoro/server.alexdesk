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
        confirmToken: override.confirmToken === undefined ? 'a1df4350-5fcb-4377-8bfb-6576801cda51' : override.confirmToken
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


describe('DAL::serviceUserGetResetPasswordConfirmData', function () {

    it('Must not pass invalid confirmToken', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserGetResetPasswordConfirmData(argsBuilder({confirmToken: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUserGetResetPasswordConfirmData(argsBuilder({confirmToken: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUserGetResetPasswordConfirmData(argsBuilder({confirmToken: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUserGetResetPasswordConfirmData(argsBuilder({confirmToken: '0cec4d47-d9a1-4984-XXXX-10583b674123'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUserGetResetPasswordConfirmData(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                var expected = {
                    id: 'a1df4350-5fcb-4377-8bfb-6576801cda51',
                    userId: '1',
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
            api.serviceUserGetResetPasswordConfirmData(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result, 'Expected and actual values are not match');
                doneExecute();
            });
        }, doneTest);
    });

});