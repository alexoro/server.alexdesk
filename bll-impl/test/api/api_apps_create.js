/**
 * Created by UAS on 01.05.2014.
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
        accessToken: override.accessToken === undefined ? '142b2b49-75f2-456f-9533-435bd0ef94c0' : override.accessToken,
        platform: override.platform === undefined ? domain.platforms.ANDROID : override.platform,
        title: override.title === undefined ? 'Application from test' : override.title,
        extra: {
            package: override.package === undefined ? 'com.fromtest' : override.package
        }
    };
};


describe('API#apps_create', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.apps_create(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create({}, invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Check invalid access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'});
        api.apps_create(args, function(err) {
            if (err.number && err.number === dErrors.INVALID_PARAMS) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Invalid token was processed as valid');
                doneTest();
            }
        });
    });

    it('Check expired access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({accessToken: '390582c6-a59b-4ab2-a8e1-87fdbb291b97'});
        api.apps_create(args, function(err) {
            if (err && err.number === dErrors.INVALID_OR_EXPIRED_TOKEN) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Expired access token was processed as valid');
                doneTest();
            }
        });
    });

    it('Validate invalid arguments: platform', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.apps_create(argsBuilder({platform: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(argsBuilder({platform: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(argsBuilder({platform: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(argsBuilder({platform: 100}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: title is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.apps_create(argsBuilder({title: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(argsBuilder({title: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(argsBuilder({title: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(argsBuilder({title: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: package is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.apps_create(argsBuilder({package: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(argsBuilder({package: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.apps_create(argsBuilder({package: new Array(100).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    // ==============================================================

    it('Must support only Android applications', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.apps_create(argsBuilder({platform: domain.platforms.WEB}), function(err, app) {
            if (err && err.number === dErrors.LOGIC_ERROR) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Not Android application was created');
                doneTest();
            }
        });
    });

    it('Must not allow application user to create app', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.apps_create(argsBuilder({accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a'}), function(err, app) {
            if (err && err.number === dErrors.ACCESS_DENIED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Application user did create the application');
                doneTest();
            }
        });
    });

    it('Must create app', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder();
        api.apps_create(reqArgs, function(err, app) {
            if (err) {
                return doneTest(err);
            }

            var matchApp = {
                id: '1000',
                platform: reqArgs.platform,
                title: reqArgs.title,
                created: new Date('2014-05-15 00:00:00 +00:00'),
                isApproved: true,
                isBlocked: false,
                isDeleted: false,
                extra: {
                    package: reqArgs.package
                },
                ownerUserId: '1'
            };

            assert.deepEqual(app, matchApp, 'Created chat is not match with expected');
            doneTest();
        });
    });

    it('App must be created in storage', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder();
        api.apps_create(reqArgs, function(err, app) {
            if (err) {
                return doneTest(err);
            }

            api.apps_list({accessToken: reqArgs.accessToken}, function(err, apps) {
                if (err) {
                    doneTest(err);
                } else {
                    for (var i = 0; i < apps.length; i++) {
                        if (apps[i].id === '1000') {
                            return doneTest();
                        }
                    }
                    assert.fail('Just created application was not found in storage');
                    doneTest();
                }
            });
        });
    });

});
