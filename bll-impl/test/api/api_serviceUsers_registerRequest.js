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
        login: override.login === undefined ? 'xxx@xxx.com' : override.login,
        password: override.password === undefined ? 'xxx@xxx.com' : override.password,
        name: override.name === undefined ? 'xxx user' : override.name
    };
};


describe('API#serviceUsers_registerRequest', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_registerRequest(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: login/email is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({login: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({login: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({login: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({login: 'xxx@xxx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                var email = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789@www.com';
                api.serviceUsers_registerRequest(argsBuilder({login: email}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: password is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({password: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({password: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({password: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({password: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: name is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({name: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({name: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_registerRequest(argsBuilder({name: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Must return INTERNAL_ERROR in case of error in DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.serviceUserGetCredentialsByLogin = function(args, done) {
            done(new Error('Not implemented yet'));
        };

        var api = mock.api;
        var reqArgs = argsBuilder();
        api.serviceUsers_registerRequest(reqArgs, function(err, newUser) {
            if (err && err.number && err.number === dErrors.INTERNAL_ERROR) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return INTERNAL_ERROR for error in DAL');
                doneTest();
            }
        });
    });

    it('Must return INTERNAL_ERROR in case of invalid response from DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.serviceUserGetCredentialsByLogin = function(args, done) {
            done(null, 1);
        };

        var api = mock.api;
        var reqArgs = argsBuilder();
        api.serviceUsers_registerRequest(reqArgs, function(err, newUser) {
            if (err && err.number && err.number === dErrors.INTERNAL_ERROR) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return INTERNAL_ERROR for invalid response from DAL');
                doneTest();
            }
        });
    });

    // =========================================================

    it('Must not create user with matching login', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.serviceUsers_registerRequest(argsBuilder({login: 'test@test.com'}), function(err, user) {
            if (err && err.number === dErrors.USER_ALREADY_EXISTS) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Service user was created with duplicated login');
                doneTest();
            }
        });
    });

    it('Must return valid user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder();
        api.serviceUsers_registerRequest(reqArgs, function(err, user) {
            if (err) {
                return doneTest(err);
            }

            var matchUser = {
                confirmation: {
                    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                    expires: new Date('2020-01-01 00:00:00 +00:00')
                },
                user: {
                    id: '1000',
                    login: reqArgs.login,
                    name: reqArgs.name,
                    registered: new Date('2014-05-15 00:00:00 +00:00'),
                    lastVisit: new Date('2014-05-15 00:00:00 +00:00'),
                    isConfirmed: false
                }
            };

            assert.deepEqual(user, matchUser, 'Created user is not match with expected');
            doneTest();
        });
    });

    it('Must fetch user after registration', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        api.serviceUsers_registerRequest(argsBuilder(), function(err, user) {
            if (err) {
                return doneTest(err);
            }

            var passwordHash = '02a243c4202b23e8ec78620f1ff48aa6';
            var reqArgs = {login: 'xxx@xxx.com'};
            mock.dal.serviceUserGetCredentialsByLogin(reqArgs, function(err, creditionals) {
                if (err) {
                    return doneTest(err);
                } else if (!creditionals) {
                    assert.fail('User was created but was not written database or cannot be fetched via #getServiceUserCreditionalsByLogin');
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

    it('Must call the emailSender#sendServiceUserRegistrationConfirmLink', function(doneTest) {
        var isCalled = false;
        var Sender = {
            sendServiceUserRegistrationConfirmLink: function (args, done) {
                isCalled = true;
                done();
            },
            sendServiceUserResetPasswordConfirmLink: function(args, done) {
                done(new Error('Mock implementation'));
            }
        };

        var api = mockBuilder.newApiWithMock({notificationsManager: Sender}).api;
        var reqArgs = argsBuilder();
        api.serviceUsers_registerRequest(reqArgs, function(err) {
            if (err) {
                return doneTest(err);
            }
            if (!isCalled) {
                assert.fail('#sendServiceUserRegistrationConfirmLink was not called');
                doneTest();
            } else {
                doneTest();
            }
        });

    });

});