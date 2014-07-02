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
        chatId: override.chatId === undefined ? '1' : override.chatId
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


describe('DAL::chatIsExists', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatIsExists(argsBuilder({chatId: {}}), cb);
                },
                function (cb) {
                    api.chatIsExists(argsBuilder({chatId: null}), cb);
                },
                function (cb) {
                    api.chatIsExists(argsBuilder({chatId: '-1'}), cb);
                },
                function (cb) {
                    api.chatIsExists(argsBuilder({chatId: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return true if chat exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chatIsExists(reqArgs, function (err, isExists) {
                if (err) {
                    return doneExecute(err);
                }
                assert.strictEqual(isExists, true, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return false if chat not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatId: '1000'});
            api.chatIsExists(reqArgs, function (err, isExists) {
                if (err) {
                    return doneExecute(err);
                }
                assert.strictEqual(isExists, false, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});