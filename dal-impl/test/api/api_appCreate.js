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

var invalidArgsCallback = function (done) {
    return function (err) {
        if (err && err.type === dErr.INVALID_PARAMS) {
            done();
        } else if (err) {
            done(err);
        } else {
            done(new Error('Application was created with invalid param'));
        }
    };
};


describe('DAL::appCreate', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({id: 1}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({id: '-1'}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({id: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid platform type', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({platform: '-1'}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({platform: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid title', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({title: 1}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({title: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid created date', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({created: 1}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({created: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid isApproved', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({isApproved: 1}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({isApproved: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid isBlocked', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({isBlocked: 1}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({isBlocked: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid isDeleted', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({isDeleted: 1}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({isDeleted: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid ownerUserId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({ownerUserId: 1}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({ownerUserId: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid extra holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.extra;
                    api.appCreate(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = null;
                    api.appCreate(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.extra = 'x';
                    api.appCreate(reqArgs, cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid package', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.appCreate(argsBuilder({package: 1}), cb);
                },
                function (cb) {
                    api.appCreate(argsBuilder({package: null}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.appCreate(reqArgs, function (err) {
                doneExecute(err);
            });
        }, doneTest);
    });

});