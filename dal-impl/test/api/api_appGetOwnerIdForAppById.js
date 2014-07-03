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
        appId: override.appId === undefined ? '1' : override.appId
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


describe('DAL::appGetOwnerIdForAppById', function () {

    it('Must not pass invalid appId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appGetOwnerIdForAppById(argsBuilder({appId: 1}), cb);
                },
                function (cb) {
                    api.appGetOwnerIdForAppById(argsBuilder({appId: '-1'}), cb);
                },
                function (cb) {
                    api.appGetOwnerIdForAppById(argsBuilder({appId: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return error if application not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({appId: 1000});
            api.appGetOwnerIdForAppById(reqArgs, function (err) {
                if (err && err.number === dErr.APP_IS_NOT_FOUND) {
                    doneExecute();
                } else if (err) {
                    doneExecute(err);
                } else {
                    doneExecute(new Error('Method was successfully executed with not existing app'));
                }
            });
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appGetOwnerIdForAppById(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                var expected = {
                    id: '1',
                    type: 1
                };
                assert.deepEqual(result, expected, 'Expected and received results are not match');
                doneExecute();
            });
        }, doneTest);
    });

});