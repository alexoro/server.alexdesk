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
        confirmToken: override.confirmToken === undefined ? 'a1df4350-5fcb-4377-8bfb-6576801cda51' : override.confirmToken,
        newPassword: override.newPassword === undefined ? '123' : override.newPassword
    };
};


describe('API#serviceUsers_resetPasswordConfirm', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_resetPasswordConfirm(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordConfirm(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordConfirm(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Check invalid confirmToken', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({confirmToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'});
        api.serviceUsers_resetPasswordConfirm(args, function(err) {
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

    it('Validate invalid arguments: password is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_resetPasswordConfirm(argsBuilder({newPassword: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordConfirm(argsBuilder({newPassword: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordConfirm(argsBuilder({newPassword: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_resetPasswordConfirm(argsBuilder({newPassword: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    // =========================================================

    it('Check expired confirmToken', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({confirmToken: '86fb45f6-2bd4-4918-bd6b-887b6d51b0a9'});
        api.serviceUsers_resetPasswordConfirm(args, function(err) {
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
        api.serviceUsers_resetPasswordConfirm(argsBuilder({confirmToken: '5e604462-4f09-4077-afe7-d84bcdb5004e'}), function(err, user) {
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
        api.serviceUsers_resetPasswordConfirm(argsBuilder({confirmToken: 'd8463bf9-0af6-4db6-86b7-f9c366cc289e'}), function(err, user) {
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
        api.serviceUsers_resetPasswordConfirm(reqArgs, function(err) {
            doneTest(err);
        });
    });

    it('Must change the password', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        var dal = mock.dal;
        api.serviceUsers_resetPasswordConfirm(argsBuilder(), function(err) {
            if (err) {
                return doneTest(err);
            }

            var passwordHash = '202cb962ac59075b964b07152d234b70';
            var reqArgs = {
                login: 'test@test.com'
            };
            dal.serviceUsers_getCredentialsByLogin(reqArgs, function (err, creditionals) {
                if (err) {
                    doneTest(err);
                } else if (!creditionals) {
                    assert.fail('User with new password was not found');
                    doneTest();
                } else if (creditionals.passwordHash !== passwordHash) {
                    assert.fail('User was created with wrong passwordHash');
                    doneTest();
                } else {
                    doneTest();
                }
            });
        });
    });

});