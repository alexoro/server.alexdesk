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


describe('DAL::chats_getAppId', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_getAppId(argsBuilder({chatId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_getAppId(argsBuilder({chatId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_getAppId(argsBuilder({chatId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_getAppId(argsBuilder({chatId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return -1 if chat is not found', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatId: '1000'});
            api.chats_getAppId(reqArgs, function (err, appId) {
                if (err) {
                    return doneExecute(err);
                }
                assert.strictEqual(appId, '-1', 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chats_getAppId(reqArgs, function (err, appId) {
                if (err) {
                    return doneExecute(err);
                }
                assert.strictEqual(appId, '1', 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});