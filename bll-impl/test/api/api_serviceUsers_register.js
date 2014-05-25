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


describe('API#serviceUsers_register', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_register(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: login/email is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_register(argsBuilder({login: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(argsBuilder({login: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(argsBuilder({login: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(argsBuilder({login: 'xxx@xxx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                var email = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789@www.com';
                api.serviceUsers_register(argsBuilder({login: email}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: password is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_register(argsBuilder({password: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(argsBuilder({password: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(argsBuilder({password: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(argsBuilder({password: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: name is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.serviceUsers_register(argsBuilder({name: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(argsBuilder({name: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.serviceUsers_register(argsBuilder({name: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Must return INTERNAL_ERROR in case of error in DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.getServiceUserCreditionalsByLogin = function(args, done) {
            done(new Error('Not implemented yet'));
        };

        var api = mock.api;
        var reqArgs = argsBuilder();
        api.serviceUsers_register(reqArgs, function(err, newUser) {
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
        mock.dal.getServiceUserCreditionalsByLogin = function(args, done) {
            done(null, 1);
        };

        var api = mock.api;
        var reqArgs = argsBuilder();
        api.serviceUsers_register(reqArgs, function(err, newUser) {
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
        api.serviceUsers_register(argsBuilder({login: 'test@test.com'}), function(err, user) {
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
        api.serviceUsers_register(argsBuilder(), function(err, user) {
            if (err) {
                return doneTest(err);
            }

            var matchUser = {
                id: '1000',
                login: reqArgs.login,
                name: reqArgs.name,
                registered: new Date('2014-05-15 00:00:00 +00:00'),
                lastVisit: new Date('2014-05-15 00:00:00 +00:00'),
                isConfirmed: false
            };

            assert.deepEqual(user, matchUser, 'Created user is not match with expected');
            doneTest();
        });
    });

    it('Must fetch user after registration', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        api.serviceUsers_register(argsBuilder(), function(err, user) {
            if (err) {
                return doneTest(err);
            }

            var reqArgs = {login: 'xxx@xxx.com', passwordHash: '02a243c4202b23e8ec78620f1ff48aa6'};
            mock.dal.getServiceUserIdByCreditionals(reqArgs, function(err, userId) {
                if (err) {
                    return doneTest(err);
                } else if (!userId) {
                    assert.fail('User was created but was not written database or cannot be fetched via #getServiceUserIdByCreditionals');
                    doneTest();
                } else {
                    doneTest();
                }
            });
        });
    });

    it('Name must be escaped', function(doneTest) {
        var name = '<a href="xas">Ololo</a>';

        var api = mockBuilder.newApiWithMock().api;
        api.serviceUsers_register(argsBuilder({name: name}), function(err, user) {
            if (err) {
                return doneTest(err);
            }

            assert.equal(user.name, '&lt;a href&#61;&#34;xas&#34;&gt;Ololo&lt;/a&gt;', 'Name have not been escaped');
            doneTest();
        });
    });

});