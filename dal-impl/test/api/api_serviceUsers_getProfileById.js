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
        id: override.id === undefined ? '1' : override.id
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


describe('DAL::serviceUsers_getProfileById', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUsers_getProfileById(argsBuilder({id: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_getProfileById(argsBuilder({id: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_getProfileById(argsBuilder({id: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.serviceUsers_getProfileById(argsBuilder({id: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return null if id not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({id: '1000'});
            api.serviceUsers_getProfileById(reqArgs, function (err, profile) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(profile, 'Expected and actual results are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUsers_getProfileById(reqArgs, function (err, profile) {
                if (err) {
                    return doneExecute(err);
                }

                var expected = {
                    id: '1',
                    login: 'test@test.com',
                    passwordHash: 'b642b4217b34b1e8d3bd915fc65c4452',
                    name: 'Test',
                    registered: new Date('2014-05-01 12:00:00 +04:00'),
                    lastVisit: new Date('2014-05-01 14:00:00 +04:00'),
                    isConfirmed: true
                };
                assert.deepEqual(profile, expected, 'Expected and actual results are not match');
                doneExecute();
            });
        }, doneTest);
    });

});