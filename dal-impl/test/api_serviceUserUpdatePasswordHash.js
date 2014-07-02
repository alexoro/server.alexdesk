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
        userId: override.userId === undefined ? '1' : override.userId,
        passwordHash: override.passwordHash === undefined ? '38fc19f11acfd8645b74def902ab5ffc' : override.passwordHash
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


describe('DAL::serviceUserUpdatePasswordHash', function () {

    it('Must not pass invalid userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserUpdatePasswordHash(argsBuilder({userId: {}}), cb);
                },
                function (cb) {
                    api.serviceUserUpdatePasswordHash(argsBuilder({userId: null}), cb);
                },
                function (cb) {
                    api.serviceUserUpdatePasswordHash(argsBuilder({userId: -1}), cb);
                },
                function (cb) {
                    api.serviceUserUpdatePasswordHash(argsBuilder({userId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid passwordHash', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserUpdatePasswordHash(argsBuilder({passwordHash: {}}), cb);
                },
                function (cb) {
                    api.serviceUserUpdatePasswordHash(argsBuilder({passwordHash: null}), cb);
                },
                function (cb) {
                    api.serviceUserUpdatePasswordHash(argsBuilder({passwordHash: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUserUpdatePasswordHash(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

    it('Must update passwordHash', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsCreate = argsBuilder();
            api.serviceUserUpdatePasswordHash(reqArgsCreate, function (err) {
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
                        assert.strictEqual(profile.passwordHash, reqArgsCreate.passwordHash, 'Expected result is not match w/ actual');
                        return doneExecute();
                    }
                });
            });
        }, doneTest);
    });

});