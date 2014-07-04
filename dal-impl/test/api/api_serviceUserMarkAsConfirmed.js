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
        userId: override.userId === undefined ? '3' : override.userId
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


describe('DAL::serviceUserMarkAsConfirmed', function () {

    it('Must not pass invalid userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserMarkAsConfirmed(argsBuilder({userId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUserMarkAsConfirmed(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUserMarkAsConfirmed(argsBuilder({userId: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUserMarkAsConfirmed(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUserMarkAsConfirmed(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

    it('Must update confirm flag', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsCreate = argsBuilder();
            api.serviceUserMarkAsConfirmed(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    id: reqArgsCreate.userId
                };
                api.serviceUserGetProfileById(reqArgsGet, function (err, profile) {
                    if (err) {
                        return doneExecute(err);
                    } else {
                        assert.isNotNull(profile, 'Just updated data was not found');
                        assert.strictEqual(profile.isConfirmed, true, 'Expected result is not match w/ actual');
                        return doneExecute();
                    }
                });
            });
        }, doneTest);
    });

});