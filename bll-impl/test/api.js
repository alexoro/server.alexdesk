/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var assert = require('chai').assert;
var async = require('async');

var uuidDef = require('../../uuid-generator');
var bllIntf = require('../../bll-interface');
var bllErrors = bllIntf.errors;

var mockDalDef = require('./_mockDal');
var validate = require('./_validation');
var apiDef = require('../').api;


describe('API methods', function() {

    var cbCheckValidAccessToken = function(doneTest) {
        return function(err, result) {
            if (err) {
                if (err.number && err.number === bllErrors.INVALID_PARAMS) {
                    assert.fail('Valid access token did processed as invalid');
                } else {
                    doneTest(err);
                }
            }
            doneTest();
        };
    };

    var cbCheckInvalidAccessToken = function(doneTest) {
        return function(err, result) {
            if (err) {
                if (err.number && err.number !== bllErrors.INVALID_PARAMS) {
                    assert.fail('Unknown error during checking the valid access token: ' + err);
                }
            } else {
                doneTest(err);
            }
            doneTest();
        };
    };

    var cbCheckExpiredAccessToken = function(doneTest) {
        return function(err, result) {
            if (err) {
                if (err.number !== bllErrors.INVALID_OR_EXPIRED_TOKEN) {
                    doneTest(err);
                }
            } else {
                assert.fail('Expired access token was processed as valid');
            }
            doneTest();
        };
    };


    describe('#apps_list', function() {
        var mockDal;
        var api;

        before(function() {
            try {
                mockDal = new mockDalDef(require('./_mockData').getCopy());
                api = new apiDef(mockDal, null); // null is specially here - check that method must work without it
            } catch(err) {
                assert.fail('Unable to instantiate mock data and DAL: ' + err);
            }
        });

        it('Check token is missed or invalid args', function(doneTest) {
            var fnStack = [
                function(cb) {
                    api.apps_list(null, cb);
                },
                function(cb) {
                    api.apps_list({}, cb);
                },
                function(cb) {
                    api.apps_list(new Date(), cb);
                },
                function(cb) {
                    api.apps_list('', cb);
                }
            ];

            async.series(
                fnStack,
                function(err) {
                    if (err && err.number && err.number === bllErrors.INVALID_PARAMS) {
                        doneTest();
                    } else if (err) {
                        doneTest(err);
                    } else {
                        assert.fail('app_list passed invalid arguments');
                        doneTest();
                    }
                }
            );
        });

        it('Check valid access token', function(doneTest) {
            var args = {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0'};
            api.apps_list(args, cbCheckValidAccessToken(doneTest));
        });

        it('Check invalid access token', function(doneTest) {
            var args = {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'};
            api.apps_list(args, cbCheckInvalidAccessToken(doneTest));
        });

        it('Check expired access token', function(doneTest) {
            var args = {access_token: '390582c6-a59b-4ab2-a8e1-87fdbb291b97'};
            api.apps_list(args, cbCheckExpiredAccessToken(doneTest));
        });

        it('Service user must have access to applications list method', function(doneTest) {
            api.apps_list(
                {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0'},
                function(err, result) {
                    if (err && err.number && err.number === bllErrors.ACCESS_DENIED) {
                        assert.fail('Access denied to applications list method for valid user');
                        doneTest();
                    } else {
                        doneTest(err);
                    }
                }
            );
        });

        it('Application user must not have access to applications list method', function(doneTest) {
            api.apps_list(
                {access_token: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a'},
                function(err, result) {
                    if (err && err.number && err.number === bllErrors.ACCESS_DENIED) {
                        doneTest();
                    } else if (err) {
                        doneTest(err);
                    } else {
                        assert.fail('Application user get access to applications list method');
                        doneTest();
                    }
                }
            );
        });

        it('Check applications list response', function(doneTest) {
            api.apps_list(
                {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0'},
                function(err, apps) {
                    if (err) {
                        return doneTest(err);
                    }

                    assert.equal(apps.length, 1, 'Invalid number of applications');

                    var matchApp = {
                        id: '1',
                        platform_type: bllIntf.platforms.ANDROID,
                        title: 'Test App',
                        created: new Date('2014-05-01 13:00:00 +04:00'),
                        is_approved: true,
                        is_blocked: false,
                        is_deleted: false,
                        extra: {
                            package: 'com.testapp'
                        },
                        number_of_chats: 3,
                        number_of_all_messages: 8,
                        number_of_unread_messages: 1
                    };

                    assert.deepEqual(apps[0], matchApp, 'Expected application information and application in response is not match');

                    doneTest();
                }
            );
        });
    });

    describe('#security_createAuthTokenForServiceUser', function() {
        var mockDal;
        var api;

        var argsBuilder = function(userType, login, password) {
            return {
                login: login, password: password
            };
        };

        var fnStackInvalidArgsCallback = function(doneTest) {
            return function(err) {
                if (err && err.number && err.number === bllErrors.INVALID_PARAMS) {
                    doneTest();
                } else if (err) {
                    doneTest(err);
                } else {
                    assert.fail('Application passed some invalid argument');
                    doneTest();
                }
            };
        };

        before(function(doneBefore) {
            try {
                mockDal = new mockDalDef(require('./_mockData').getCopy());
            } catch(err) {
                assert.fail('Unable to instantiate mock data and DAL: ' + err);
            }

            var uuid = new uuidDef();
            uuid.init(uuid.minNodeId, function(err) {
                if (err) {
                    return doneBefore(err);
                }
                api = new apiDef(mockDal, uuid);
                doneBefore();
            });
        });

        it('Validate invalid arguments: all is invalid', function(doneTest) {
            var fnStack = [
                function(cb) {
                    api.security_createAuthTokenForServiceUser(null, cb);
                },
                function(cb) {
                    api.security_createAuthTokenForServiceUser({}, cb);
                },
                function(cb) {
                    api.security_createAuthTokenForServiceUser(-1, cb);
                }
            ];
            async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
        });

        it('Validate invalid arguments: email is invalid', function(doneTest) {
            var fnStack = [
                function(cb) {
                    api.security_createAuthTokenForServiceUser(argsBuilder(null, null), cb);
                },
                function(cb) {
                    api.security_createAuthTokenForServiceUser(argsBuilder({}, null), cb);
                },
                function(cb) {
                    api.security_createAuthTokenForServiceUser(argsBuilder('', null), cb);
                },
                function(cb) {
                    api.security_createAuthTokenForServiceUser(argsBuilder('xxx@xx:com', null), cb);
                },
                function(cb) {
                    var email = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
                    api.security_createAuthTokenForServiceUser(argsBuilder(email, null), cb);
                }
            ];
            async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
        });

        it('Validate invalid arguments: password is invalid', function(doneTest) {
            var fnStack = [
                function(cb) {
                    api.security_createAuthTokenForServiceUser(argsBuilder('zzzzz', null), cb);
                },
                function(cb) {
                    api.security_createAuthTokenForServiceUser(argsBuilder('xxx@xxx.com', {}), cb);
                },
                function(cb) {
                    api.security_createAuthTokenForServiceUser(argsBuilder('xxx@xxx.com', ''), cb);
                }
            ];
            async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
        });

        it('Token must not be created for unknown/not registered user', function(doneTest) {
            var reqArgs = argsBuilder('test@test.com', '1');
            api.security_createAuthTokenForServiceUser(reqArgs, function(err, result) {
                if (err && err.number && err.number === bllErrors.USER_NOT_FOUND) {
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
            var reqArgs = argsBuilder('test@test.com', 'test@test.com');
            api.security_createAuthTokenForServiceUser(reqArgs, function(err, result) {
                if (err) {
                    return doneTest(err);
                }

                assert.isObject(result, 'The result is not a object');
                assert.lengthOf(result.length, 2, 'The result object must contain only two fields');
                assert.isDefined(result.token, 'Token field is not defined');
                assert.isDefined(result.expires, 'Expires field is not defined');

                if (!validate.guid(result.token)) {
                    assert.fail('Token is not a string or not in guid format. Given: ' + result.token);
                }

                assert.instanceOf(result.expires, Date, 'Expires is not a date');
                assert.operator(result.expires.getTime(), '>', new Date().getTime(), 'Expire time should be greater than current time');

                doneTest();
            });
        });

        it('Token must be written to DAL with valid type and id', function(doneTest) {
            var reqArgs = argsBuilder('test@test.com', 'test@test.com');
            api.security_createAuthTokenForServiceUser(reqArgs, function(err, result) {
                if (err) {
                    return doneTest(err);
                }
                mockDal.getUserMainInfoByToken(result.token, function(errUser, resultUser) {
                    if (errUser) {
                        return doneTest(errUser);
                    }

                    assert.isNotNull(resultUser, 'User must be found by created access token');
                    assert.strictEqual(resultUser.type, bllIntf.userTypes.SERVICE_USER, 'The type of created auth token must be for a service user');
                    assert.strictEqual(resultUser.id, '1', 'The user id is not matches with just created token');
                    doneTest();
                });
            });
        });
    });

});