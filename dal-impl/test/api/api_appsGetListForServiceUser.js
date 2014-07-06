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
        userId: override.userId === undefined ? '1' : override.userId
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


describe('DAL::appsGetListForServiceUser', function () {

    it('Must not pass invalid userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appsGetListForServiceUser(argsBuilder({userId: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appsGetListForServiceUser(argsBuilder({userId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appsGetListForServiceUser(argsBuilder({userId: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not return empty array if user not found', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({userId: '1000'});
            api.appsGetListForServiceUser(reqArgs, function (err, apps) {
                if (err) {
                    return doneExecute(err);
                } else {
                    assert.lengthOf(apps, 0, 'Expected to receive 0 apps');
                    doneExecute();
                }
            });
        }, doneTest);
    });

    it('Must return valid results', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appsGetListForServiceUser(reqArgs, function (err, apps) {
                if (err) {
                    return doneExecute(err);
                }

                var expected = {
                    id: '1',
                    platformType: 2,
                    title: 'Test App',
                    created: new Date('2014-05-01 13:00:00 +04:00'),
                    isApproved: true,
                    isBlocked: false,
                    isDeleted: false,
                    extra: {
                        package: 'com.testapp'
                    }
                };

                assert.lengthOf(apps, 1, 'Expected to get 1 application');
                assert.deepEqual(apps[0], expected, 'Expected and received app are not match');
                doneExecute();
            });
        }, doneTest);
    });

});