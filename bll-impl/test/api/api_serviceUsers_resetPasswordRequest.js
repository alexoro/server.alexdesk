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
        login: override.login === undefined ? 'test@test.com' : override.login
    };
};


describe('API#serviceUsers_resetPasswordRequest', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_resetPasswordRequest(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordRequest(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordRequest(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: login/email is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_resetPasswordRequest(argsBuilder({login: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordRequest(argsBuilder({login: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordRequest(argsBuilder({login: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordRequest(argsBuilder({login: 'xxx@xxx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                var email = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789@www.com';
                api.serviceUsers_resetPasswordRequest(argsBuilder({login: email}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    // ==============================================

    it('Must return error if user not exists', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.serviceUsers_resetPasswordRequest(argsBuilder({login: '1234@1234.com'}), function(err, user) {
            if (err && err.number === dErrors.USER_NOT_FOUND) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Reset password was called without error for non-existing user');
                doneTest();
            }
        });
    });

    it('Must return error if user not confirmed', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.serviceUsers_resetPasswordRequest(argsBuilder({login: '3@3.com'}), function(err, user) {
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
        api.serviceUsers_resetPasswordRequest(reqArgs, function(err, confirmProperties) {
            if (err) {
                return doneTest(err);
            }

            var matchConfirmProperties = {
                id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                expires: new Date('2020-01-01 00:00:00 +00:00').getTime()
            };

            assert.deepEqual(confirmProperties, matchConfirmProperties, 'Created confirm properties and expected are not match');
            doneTest();
        });
    });

    it('Must call the emailSender#sendServiceUserResetPasswordConfirmLink', function(doneTest) {
        var isCalled = false;
        var Sender = {
            sendServiceUserRegistrationConfirmLink: function (args, done) {
                done(new Error('Mock implementation'));
            },
            sendServiceUserResetPasswordConfirmLink: function(args, done) {
                isCalled = true;
                done();
            }
        };

        var api = mockBuilder.newApiWithMock({notificationsManager: Sender}).api;
        var reqArgs = argsBuilder();
        api.serviceUsers_resetPasswordRequest(reqArgs, function(err) {
            if (err) {
                return doneTest(err);
            }
            if (!isCalled) {
                assert.fail('#sendServiceUserResetPasswordConfirmLink was not called');
                doneTest();
            } else {
                doneTest();
            }
        });

    });

});