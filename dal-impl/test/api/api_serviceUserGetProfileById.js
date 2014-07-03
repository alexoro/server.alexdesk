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


describe('DAL::serviceUserGetProfileById', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserGetProfileById(argsBuilder({id: {}}), cb);
                },
                function (cb) {
                    api.serviceUserGetProfileById(argsBuilder({id: null}), cb);
                },
                function (cb) {
                    api.serviceUserGetProfileById(argsBuilder({id: -1}), cb);
                },
                function (cb) {
                    api.serviceUserGetProfileById(argsBuilder({id: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUserGetProfileById(reqArgs, function (err, profile) {
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

    it('Must return null if id not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({id: '1000'});
            api.serviceUserGetProfileById(reqArgs, function (err, profile) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(profile, 'Expected and actual results are not match');
                doneExecute();
            });
        }, doneTest);
    });

});