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
        userId: override.userId === undefined ? '1' : override.userId
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


describe('DAL::appsGetListForServiceUser', function () {

    it('Must not pass invalid userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appsGetListForServiceUser(argsBuilder({id: 1}), cb);
                },
                function (cb) {
                    api.appsGetListForServiceUser(argsBuilder({id: '-1'}), cb);
                },
                function (cb) {
                    api.appsGetListForServiceUser(argsBuilder({id: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not return error if user not found', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({userId: '1000'});
            api.appsGetListForServiceUser(reqArgs, function (err) {
                if (err && err.number === dErr.USER_NOT_FOUND) {
                    doneExecute();
                } else if (err) {
                    doneExecute(err);
                } else {
                    doneExecute(new Error('Method returned result for not found user'));
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