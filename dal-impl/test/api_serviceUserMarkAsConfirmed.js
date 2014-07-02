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
        userId: override.userId === undefined ? '3' : override.userId
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


describe('DAL::serviceUserMarkAsConfirmed', function () {

    it('Must not pass invalid userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserMarkAsConfirmed(argsBuilder({userId: {}}), cb);
                },
                function (cb) {
                    api.serviceUserMarkAsConfirmed(argsBuilder({userId: null}), cb);
                },
                function (cb) {
                    api.serviceUserMarkAsConfirmed(argsBuilder({userId: -1}), cb);
                },
                function (cb) {
                    api.serviceUserMarkAsConfirmed(argsBuilder({userId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
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