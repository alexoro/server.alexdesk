/**
 * Created by UAS on 01.05.2014.
 */

"use strict";


var assert = require('chai').assert;
var async = require('async');

var domain = require('../../').domain;
var dErrors = domain.errors;

var mockBuilder = require('./mock/');
var validate = require('./_validation');


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
        login: override.login === undefined ? 'test@test.com' : override.login,
        password: override.password === undefined ? 'test@test.com' : override.password
    };
};


describe('API#security_createAuthTokenForServiceUser', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.security_createAuthTokenForServiceUser(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.security_createAuthTokenForServiceUser(-1, invalidArgsCb(cb));
            },
            function(cb) {
                api.security_createAuthTokenForServiceUser(new Date(), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: email is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.security_createAuthTokenForServiceUser(argsBuilder({login: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.security_createAuthTokenForServiceUser(argsBuilder({login:{}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.security_createAuthTokenForServiceUser(argsBuilder({login: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.security_createAuthTokenForServiceUser(argsBuilder({login: 'xxx@xx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                var email = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
                api.security_createAuthTokenForServiceUser(argsBuilder({login: email}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: password is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.security_createAuthTokenForServiceUser(argsBuilder({password: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.security_createAuthTokenForServiceUser(argsBuilder({password: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.security_createAuthTokenForServiceUser(argsBuilder({password: ''}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    // ==============================================

    it('Must not allow not confirmed user to call this method', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.security_createAuthTokenForServiceUser(argsBuilder({login: '3@3.com', password: '3@3.com'}), function(err) {
            if (err && err.number === dErrors.USER_NOT_CONFIRMED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Not confirmed user created the access token');
                doneTest();
            }
        });
    });

    it('Token must not be created in case of error', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var data = mock.data;
        var api = mock.api;

        var currentTokensLength = data.system_access_tokens.length;

        var reqArgs = argsBuilder({password: '1'});
        api.security_createAuthTokenForServiceUser(reqArgs, function(err, result) {
            if (err) {
                assert.strictEqual(data.system_access_tokens.length, currentTokensLength, 'In case of error token must not be created');
                doneTest();
            } else {
                doneTest(err);
            }
        });
    });

    it('Token must not be created for unknown/not registered user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({password: '1'});
        api.security_createAuthTokenForServiceUser(reqArgs, function(err, result) {
            if (err && err.number && err.number === dErrors.USER_NOT_FOUND) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Token was successfully created for unknown/not registered user');
                doneTest();
            }
        });
    });

    it('Token must be created for valid service user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder();
        api.security_createAuthTokenForServiceUser(reqArgs, function(err, result) {
            if (err && err.number && err.number === dErrors.USER_NOT_FOUND) {
                assert.fail('Known user was not found with creditionals');
                return doneTest();
            } else if (err) {
                return doneTest(err);
            }

            assert.isObject(result, 'The result is not a object');
            assert.isDefined(result.token, 'Token field is not defined');
            assert.isDefined(result.expires, 'Expires field is not defined');

            if (!validate.guid(result.token)) {
                assert.fail('Token is not a string or not in guid format. Given: ' + result.token);
            }

            assert.typeOf(result.expires, 'number', 'Expires is not a timestamp');
            assert.operator(result.expires, '>', Date.now(), 'Expire time should be greater than current time');

            doneTest();
        });
    });

    it('Token must be written to DAL with valid type and id', function(doneTest) {
        var mockApi = mockBuilder.newApiWithMock();
        var api = mockApi.api;
        var reqArgs = argsBuilder();
        api.security_createAuthTokenForServiceUser(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }
            mockApi.dal.getUserMainInfoByToken(result.token, function(errUser, resultUser) {
                if (errUser) {
                    return doneTest(errUser);
                }

                var matchUserMainInfo = {
                    id: '1',
                    type: domain.userTypes.SERVICE_USER
                };
                assert.deepEqual(matchUserMainInfo, resultUser, 'Expected token and token in response are not match');
                doneTest();
            });
        });
    });

    it('Check token is used from uuid-generator', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('test@test.com', 'test@test.com');
        api.security_createAuthTokenForServiceUser(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }
            assert.strictEqual(result.token, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Module must use uuid generator. Provided token and result are not match');
            doneTest();
        });
    });

    it('Check that not working uuid forces code to return INTERNAL_ERROR', function(doneTest) {
        var UUID = function() {};
        UUID.prototype.newBigInt = function(done) {
            done(new Error('Not implemented yet'));
        };
        UUID.prototype.newGuid4 = function(done) {
            done(new Error('Not implemented yet'));
        };
        var uuid = new UUID();

        var api = mockBuilder.newApiWithMock({uuid: uuid}).api;
        api.security_createAuthTokenForServiceUser(argsBuilder(), function(err, result) {
            if (!err || !err.number || err.number !== dErrors.INTERNAL_ERROR) {
                assert.fail('Method did not respond with INTERNAL_ERROR for not error on uuid');
            }
            doneTest();
        });
    });
});
