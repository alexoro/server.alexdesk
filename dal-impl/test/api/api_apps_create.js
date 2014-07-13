/**
 * Created by UAS on 12.06.2014.
 */

"use strict";


var assert = require('chai').assert;
var async = require('async');

var domain = require('../../src/index').domain;
var dErr = domain.errors;

var mock = require('./../mock/index');


var argsBuilder = function(override) {
    if (!override) {
        override = {};
    }

    return {
        id: override.id === undefined ? '1000' : override.id,
        platform: override.platform === undefined ? 2 : override.platform,
        title: override.title === undefined ? 'Test App for create' : override.title,
        created: override.created === undefined ? new Date('2014-01-01 00:00:00') : override.created,
        isApproved: override.isApproved === undefined ? true : override.isApproved,
        isBlocked: override.isBlocked === undefined ? false : override.isBlocked,
        isDeleted: override.isDeleted === undefined ? false : override.isDeleted,
        ownerUserId: override.ownerUserId === undefined ? '1' : override.ownerUserId,
        extra: {
            package: override.package === undefined ? 'com.testapp' : override.package
        }
    };
};

var invalidArgsCallbackEntry = function (cb) {
    return function (err) {
        if (err && err.number === dErr.INVALID_PARAMS) {
            cb();
        } else if (err) {
            cb(err);
        } else {
            cb(new Error('Method was executed with invalid params'));
        }
    };
};


describe('DAL::apps_create', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({id: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({id: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({id: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid platform type', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({platform: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({platform: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid title', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({title: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({title: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid created date', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({created: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({created: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid isApproved', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({isApproved: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({isApproved: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid isBlocked', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({isBlocked: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({isBlocked: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid isDeleted', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({isDeleted: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({isDeleted: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid ownerUserId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({ownerUserId: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({ownerUserId: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid extra holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.extra;
                    api.apps_create(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = null;
                    api.apps_create(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = 'x';
                    api.apps_create(reqArgs, invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid package', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.apps_create(argsBuilder({package: 1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.apps_create(argsBuilder({package: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.apps_create(reqArgs, function (err) {
                doneExecute(err);
            });
        }, doneTest);
    });

    it('Must create the application', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsCreate = argsBuilder();
            api.apps_create(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    userId: reqArgsCreate.ownerUserId
                };
                api.apps_getListForServiceUser(reqArgsGet, function (err, apps) {
                    if (err) {
                        return doneExecute(err);
                    }
                    var found = false;
                    for (var i = 0; i < apps.length; i++) {
                        if (apps[i].id === reqArgsCreate.id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        assert.fail('Just created application was not found in storage');
                    }
                    doneExecute();
                });
            });
        }, doneTest);
    });

});