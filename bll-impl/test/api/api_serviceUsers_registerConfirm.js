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
        confirmToken: override.confirmToken === undefined ? '5ece1f7a-c5d0-4a09-97b6-00e8d88a04a1' : override.confirmToken
    };
};


describe('API#serviceUsers_registerConfirm', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_registerConfirm(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerConfirm(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerConfirm(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Check invalid confirmToken', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({confirmToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'});
        api.serviceUsers_registerConfirm(args, function(err) {
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
        var args = argsBuilder({confirmToken: 'de72bca0-1c76-444d-9b1a-ad1f84d04dfb'});
        api.serviceUsers_registerConfirm(args, function(err) {
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

    it('Must not confirm for already confirmed user', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({confirmToken: '0cec4d47-d9a1-4984-8f23-10583b674123'});
        api.serviceUsers_registerConfirm(args, function(err) {
            if (err && err.number === dErrors.USER_ALREADY_CONFIRMED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Already confirmed user was confirmed again');
                doneTest();
            }
        });
    });

    it('Must switch user to confirmed', function (doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        var dal = mock.dal;
        var args = argsBuilder();
        api.serviceUsers_registerConfirm(args, function(errBll) {
            if (errBll) {
                return doneTest(errBll);
            }
            dal.serviceUserIsConfirmed({userId: '3'}, function(err, isConfirmed) {
                if (err) {
                    return doneTest(err);
                }
                if (!isConfirmed) {
                    assert.fail('Confirm did not switch the isConfirmed flag to true');
                }
                doneTest();
            });
        });
    });

});