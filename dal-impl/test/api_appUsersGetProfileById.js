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
        id: override.id === undefined ? '2' : override.id
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


describe('DAL::appUsersGetProfileById', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appUsersGetProfileById(argsBuilder({appIds: {}}), cb);
                },
                function (cb) {
                    api.appUsersGetProfileById(argsBuilder({appIds: null}), cb);
                },
                function (cb) {
                    api.appUsersGetProfileById(argsBuilder({appIds: -1}), cb);
                },
                function (cb) {
                    api.appUsersGetProfileById(argsBuilder({appIds: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appUsersGetProfileById(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                var expected = {
                    id: '2',
                    appId: '1',
                    login: 'test1',
                    passwordHash: '5a105e8b9d40e1329780d62ea2265d8a',
                    name: 'Test user #1',
                    registered: new Date('2012-05-01 13:00:00 +00:00'),
                    lastVisit: new Date('2012-05-01 13:26:00 +00:00'),
                    platform: 2,
                    extra: {
                        deviceUuid: 'b97f0733069901955d4bae2c674d2fcd',
                        gcmToken: ''
                    }
                };
                assert.deepEqual(result, expected, 'Expected and received results are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return null if user not found', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({id: '1000'});
            api.appUsersGetProfileById(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

});