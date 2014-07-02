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
        id: override.id === undefined ? 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' : override.id,
        userId: override.userId === undefined ? '1' : override.userId,
        expires: override.expires === undefined ? new Date('2020-01-01 00:00:00') : override.expires
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


describe('DAL::serviceUserCreateResetPasswordConfirmData', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({id: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({id: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({id: 1}), cb);
                },
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({id: '0cec4d47-d9a1-4984-XXXX-10583b674123'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({userId: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({userId: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({userId: -1}), cb);
                },
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({userId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid expires', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({expires: {}}), cb);
                },
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({expires: null}), cb);
                },
                function (cb) {
                    api.serviceUserCreateResetPasswordConfirmData(argsBuilder({expires: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.serviceUserCreateResetPasswordConfirmData(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

    it('Created data must be accessible', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsCreate = argsBuilder();
            api.serviceUserCreateResetPasswordConfirmData(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    confirmToken: reqArgsCreate.id
                };
                api.serviceUserGetResetPasswordConfirmData(reqArgsGet, function (err, data) {
                    if (err) {
                        return doneExecute(err);
                    } else {
                        assert.isNotNull(data, 'Just created data was not found');
                        assert.deepEqual(data, reqArgsCreate, 'Expected result is not match w/ actual');
                        return doneExecute();
                    }
                });
            });
        }, doneTest);
    });

});