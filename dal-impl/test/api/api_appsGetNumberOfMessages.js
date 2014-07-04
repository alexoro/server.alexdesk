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
        appIds: override.appIds === undefined ? ['1'] : override.appIds
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


describe('DAL::appsGetNumberOfMessages', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appsGetNumberOfMessages(argsBuilder({appIds: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appsGetNumberOfMessages(argsBuilder({appIds: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appsGetNumberOfMessages(argsBuilder({appIds: [-1]}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appsGetNumberOfMessages(argsBuilder({appIds: ['-1']}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.appsGetNumberOfMessages(argsBuilder({appIds: [null]}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return error if some application is not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({appIds: ['1000']});
            api.appsGetNumberOfMessages(reqArgs, function (err) {
                if (err && err.number === dErr.APP_IS_NOT_FOUND) {
                    doneExecute();
                } else if (err) {
                    doneExecute(err);
                } else {
                    doneExecute(new Error('Method was executed with not existing app'));
                }
            });
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appsGetNumberOfMessages(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                var expected = {
                    '1': 8
                };
                assert.deepEqual(result, expected, 'Expected and received results are not match');
                doneExecute();
            });
        }, doneTest);
    });

});