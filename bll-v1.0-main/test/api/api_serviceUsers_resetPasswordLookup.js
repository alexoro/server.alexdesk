/**
 * Created by UAS on 16.05.2014.
 */

"use strict";


var assert = require('chai').assert;
var async = require('async');

var domain = require('../../').domain;
var dErrors = domain.errors;

var mockBuilder = require('./mock/');


var invalidArgsCb = function(cb) {
    return function(err) {
        if (err && err.number && err.number === dErrors.INVALID_PARAMS) {
            cb();
        } else if (err) {
            cb(err);
        } else {
            cb(new Error('Application passed some invalid argument'));
        }
    };
};

var argsBuilder = function(override) {
    if (!override) {
        override = {};
    }
    return {
        confirmToken: override.confirmToken === undefined ? 'a1df4350-5fcb-4377-8bfb-6576801cda51' : override.confirmToken
    };
};


describe('API#serviceUsers_resetPasswordLookup', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_resetPasswordLookup(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordLookup(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordLookup(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Check invalid confirmToken', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({confirmToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'});
        api.serviceUsers_resetPasswordLookup(args, function(err) {
            if (err.number && err.number === dErrors.INVALID_PARAMS) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Invalid confirmToken was processed as valid');
                doneTest();
            }
        });
    });

    // =========================================================

    it('Check expired confirmToken', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({confirmToken: '86fb45f6-2bd4-4918-bd6b-887b6d51b0a9'});
        api.serviceUsers_resetPasswordLookup(args, function(err) {
            if (err && err.number === dErrors.INVALID_OR_EXPIRED_TOKEN) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Expired confirmToken was processed as valid');
                doneTest();
            }
        });
    });

    it('Must return error if user not exists', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.serviceUsers_resetPasswordLookup(argsBuilder({confirmToken: '5e604462-4f09-4077-afe7-d84bcdb5004e'}), function(err, user) {
            if (err && err.number === dErrors.USER_NOT_FOUND) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Reset password confirm was called without error for non-existing user');
                doneTest();
            }
        });
    });

    it('Must return error if user not confirmed', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.serviceUsers_resetPasswordLookup(argsBuilder({confirmToken: 'd8463bf9-0af6-4db6-86b7-f9c366cc289e'}), function(err, user) {
            if (err && err.number === dErrors.USER_NOT_CONFIRMED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Reset password was called without error for non-confirmed user');
                doneTest();
            }
        });
    });

    it('Must return valid response', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder();
        api.serviceUsers_resetPasswordLookup(reqArgs, function(err, lookupInfo) {
            if (err) {
                doneTest(err);
            } else {
                var matchLookupInfo = {
                    login: 'test@test.com'
                };
                assert.deepEqual(lookupInfo, matchLookupInfo, 'Lookup info and expected are not match');
                doneTest();
            }
        });
    });

});