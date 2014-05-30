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
        appId: override.appId === undefined ? '1' : override.appId,
        login: override.login === undefined ? 'xxx@xxx.com' : override.login,
        password: override.password === undefined ? 'xxx@xxx.com' : override.password,
        name: override.name === undefined ? 'xxx user' : override.name,
        platform: override.platform === undefined ? domain.platforms.ANDROID : override.platform,
        extra: {
            deviceUuid: override.deviceUuid === undefined ? '012345678901234567890123456789aa' : override.deviceUuid,
            gcmToken: override.gcmToken === undefined ? 'gcmToken' : override.gcmToken
        }
    };
};


describe('API#appUsers_init', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.appUsers_init(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: login is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.appUsers_init(argsBuilder({login: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({login: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({login: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({login: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: password is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.appUsers_init(argsBuilder({password: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({password: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({password: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({password: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: name is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.appUsers_init(argsBuilder({name: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({name: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({name: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: platform', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.appUsers_init(argsBuilder({platform: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({platform: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({platform: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({platform: 100}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: device uuid is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.appUsers_init(argsBuilder({deviceUuid: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({deviceUuid: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({deviceUuid: new Array(100).join('a')}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({deviceUuid: '012345678901234567890123456789=='}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({deviceUuid: '012345678901234567890123456789xx'}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: gcm token is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.appUsers_init(argsBuilder({deviceUuid: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({deviceUuid: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.appUsers_init(argsBuilder({deviceUuid: new Array(10000).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    // =========================================================

    it('Must work only for Android users', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({platform: domain.platforms.WEB});
        api.appUsers_init(reqArgs, function(err) {
            if (err && err.number && err.number === dErrors.LOGIC_ERROR) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must allow only Android users to create the chat');
                doneTest();
            }
        });
    });

    it('Must fail on unknown application', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({appId: '400'});
        api.appUsers_init(reqArgs, function(err) {
            if (err && err.number === dErrors.APP_NOT_FOUND) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Update was successful for app user with unknown application id');
                doneTest();
            }
        });
    });

    it('Must fail update when invalid password is passed', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({login: 'test1', password: '1'});
        api.appUsers_init(reqArgs, function(err) {
            if (err && err.number === dErrors.INVALID_PASSWORD) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Update was successful for app user with invalid password');
                doneTest();
            }
        });
    });

    it('Must return valid user object in case of create', function(doneTest) {
        var reqArgs = argsBuilder();
        var api = mockBuilder.newApiWithMock().api;
        api.appUsers_init(reqArgs, function(err, appUser) {
            if (err) {
                return doneTest(err);
            }

            var matchAppUser = {
                isCreated: true,
                profile: {
                    id: '1000',
                    appId: reqArgs.appId,
                    login: reqArgs.login,
                    name: reqArgs.name,
                    platform: reqArgs.platform,
                    registered: new Date('2014-05-15 00:00:00 +00:00'),
                    lastVisit: new Date('2014-05-15 00:00:00 +00:00'),
                    extra: {
                        deviceUuid: reqArgs.extra.deviceUuid,
                        gcmToken: reqArgs.extra.gcmToken
                    }
                }
            };

            assert.deepEqual(appUser, matchAppUser, 'Just created user is not matching with expected');
            doneTest();
        });
    });

    it('Must return valid user object in case of update', function(doneTest) {
        var reqArgs = {
            login: 'test1',
            password: 'test1',
            deviceUuid: '00000000001111111111222222222299',
            gcmToken: '1'
        };
        reqArgs = argsBuilder(reqArgs);

        var api = mockBuilder.newApiWithMock().api;
        api.appUsers_init(reqArgs, function(err, appUser) {
            if (err) {
                return doneTest(err);
            }

            var matchAppUser = {
                isCreated: false,
                profile: {
                    id: '2',
                    appId: reqArgs.appId,
                    login: reqArgs.login,
                    name: reqArgs.name,
                    platform: reqArgs.platform,
                    registered: new Date('2012-05-01 13:00:00 +00:00'),
                    lastVisit: new Date('2014-05-15 00:00:00 +00:00'),
                    extra: {
                        deviceUuid: reqArgs.extra.deviceUuid,
                        gcmToken: reqArgs.extra.gcmToken
                    }
                }
            };

            assert.deepEqual(appUser, matchAppUser, 'Just updated user is not matching with expected value');
            doneTest();
        });
    });

    it('Must fetch user after create', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        var dal = mock.dal;
        api.appUsers_init(argsBuilder(), function(err, appUser) {
            if (err) {
                return doneTest(err);
            }

            var reqArgs = {
                appId: '1',
                login: 'xxx@xxx.com',
                passwordHash: '02a243c4202b23e8ec78620f1ff48aa6'
            };
            dal.getAppUserIdByCreditionals(reqArgs, function(err, appUserId) {
                if (err) {
                    doneTest(err);
                } else if (!appUserId) {
                    assert.fail('Just created app user was not found in storage');
                    doneTest();
                } else {
                    doneTest();
                }
            });
        });
    });

    it('Must fetch user after init', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        var dal = mock.dal;
        api.appUsers_init(argsBuilder({login: 'test1', password: 'test1'}), function(err, appUser) {
            if (err) {
                return doneTest(err);
            }

            var reqArgs = {
                appId: '1',
                login: 'test1',
                passwordHash: '5a105e8b9d40e1329780d62ea2265d8a'
            };
            dal.getAppUserIdByCreditionals(reqArgs, function(err, appUserId) {
                if (err) {
                    doneTest(err);
                } else if (!appUserId) {
                    assert.fail('Just created app user was not found in storage');
                    doneTest();
                } else {
                    doneTest();
                }
            });
        });
    });

    it('Name must be escaped', function(doneTest) {
        var reqArgs = {
            login: 'test1',
            password: 'test1',
            name: '<a href="xas">Ololo</a>'
        };
        reqArgs = argsBuilder(reqArgs);

        var api = mockBuilder.newApiWithMock().api;
        api.appUsers_init(reqArgs, function(err, appUser) {
            if (err) {
                return doneTest(err);
            }

            assert.equal(appUser.profile.name, '&lt;a href&#61;&#34;xas&#34;&gt;Ololo&lt;/a&gt;', 'Name have not been escaped');
            doneTest();
        });
    });

});