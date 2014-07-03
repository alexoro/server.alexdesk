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


describe('DAL::appIsExists', function () {

    it('Must not pass invalid appId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appIsExists(argsBuilder({appId: 1}), cb);
                },
                function (cb) {
                    api.appIsExists(argsBuilder({appId: '-1'}), cb);
                },
                function (cb) {
                    api.appIsExists(argsBuilder({appId: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return true if application exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appIsExists(reqArgs, function (err, isExists) {
                if (err) {
                    return doneExecute(err);
                } else {
                    assert.strictEqual(isExists, true, 'Existsing application is not found');
                    doneExecute();
                }
            });
        }, doneTest);
    });

    it('Must return false if application not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({appId: '1000'});
            api.appIsExists(reqArgs, function (err, isExists) {
                if (err) {
                    return doneExecute(err);
                } else {
                    assert.strictEqual(isExists, false, 'Not existsing application is found');
                    doneExecute();
                }
            });
        }, doneTest);
    });

});