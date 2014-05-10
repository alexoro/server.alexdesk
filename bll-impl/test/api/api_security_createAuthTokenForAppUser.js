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


var argsBuilder = function(appId, login, password) {
    return {
        app_id: appId, login: login, password: password
    };
};

var fnStackInvalidArgsCallback = function(doneTest) {
    return function(err) {
        if (err && err.number && err.number === dErrors.INVALID_PARAMS) {
            doneTest();
        } else if (err) {
            doneTest(err);
        } else {
            assert.fail('Application passed some invalid argument');
            doneTest();
        }
    };
};

describe('API#security_createAuthTokenForAppUser', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.security_createAuthTokenForAppUser(null, cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser({}, cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser(-1, cb);
            }
        ];
        async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
    });

    it('Validate invalid arguments: app id is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder(null, null, null), cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder({}, null, null), cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder('', null, null), cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder('xxx@xx:com', null), cb);
            },
            function(cb) {
                var appId = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
                api.security_createAuthTokenForAppUser(argsBuilder(appId, null, null), cb);
            }
        ];
        async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
    });

    it('Validate invalid arguments: login is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder('1', null, null), cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder('1', {}, null), cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder('1', '', null), cb);
            },
            function(cb) {
                var login = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
                api.security_createAuthTokenForAppUser(argsBuilder('1', login, null), cb);
            }
        ];
        async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
    });

    it('Validate invalid arguments: password is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder('1', 'zzzzz', null), cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder('1', 'xxx@xxx.com', {}), cb);
            },
            function(cb) {
                api.security_createAuthTokenForAppUser(argsBuilder('1', 'xxx@xxx.com', ''), cb);
            }
        ];
        async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
    });

    it('Token must not be created in case of error', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var data = mock.data;
        var api = mock.api;

        var currentTokensLength = data.system_access_tokens.length;

        var reqArgs = argsBuilder('1', 'test1', '1');
        api.security_createAuthTokenForAppUser(reqArgs, function(err, result) {
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
        var reqArgs = argsBuilder('1', 'test1', '1');
        api.security_createAuthTokenForAppUser(reqArgs, function(err, result) {
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

    it('Token must be created for valid app user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('1', 'test1', 'test1');
        api.security_createAuthTokenForAppUser(reqArgs, function(err, result) {
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
        var reqArgs = argsBuilder('1', 'test1', 'test1');
        api.security_createAuthTokenForAppUser(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }
            mockApi.dal.getUserMainInfoByToken(result.token, function(errUser, resultUser) {
                if (errUser) {
                    return doneTest(errUser);
                }

                var matchUserMainInfo = {
                    id: '2',
                    type: domain.userTypes.APP_USER
                };
                assert.deepEqual(matchUserMainInfo, resultUser, 'Expected token and token in response are not match');
                doneTest();
            });
        });
    });

    it('Check token is used from uuid-generator', function(doneTest) {
        var guid4 = '6c1bd09f-ca96-438d-adee-ff4c7c1694ba';
        var UUID = function() {};
        UUID.prototype.newBigInt = function(done) {
            done(null, '1');
        };
        UUID.prototype.newGuid4 = function(done) {
            done(null, guid4);
        };
        var uuid = new UUID();

        var api = mockBuilder.newApiWithMock({uuid: uuid}).api;
        var reqArgs = argsBuilder('1', 'test1', 'test1');
        api.security_createAuthTokenForAppUser(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }
            assert.strictEqual(result.token, guid4, 'Module must use uuid generator. Provided token and result are not match');
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
        var reqArgs = argsBuilder('1', 'test1', 'test1');
        api.security_createAuthTokenForAppUser(reqArgs, function(err, result) {
            if (!err || !err.number || err.number !== dErrors.INTERNAL_ERROR) {
                assert.fail('Method did not respond with INTERNAL_ERROR for not error on uuid');
            }
            doneTest();
        });
    });
});
