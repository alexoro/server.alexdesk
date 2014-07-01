/**
 * Created by UAS on 12.06.2014.
 */

"use strict";


var assert = require('chai').assert;
var async = require('async');

var domain = require('../src/').domain;
var dErr = domain.errors;

var mock = require('./mock');


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


describe('DAL::chatGetAppId', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatGetAppId(argsBuilder({chatId: {}}), cb);
                },
                function (cb) {
                    api.chatGetAppId(argsBuilder({chatId: null}), cb);
                },
                function (cb) {
                    api.chatGetAppId(argsBuilder({chatId: '-1'}), cb);
                },
                function (cb) {
                    api.chatGetAppId(argsBuilder({chatId: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chatGetAppId(reqArgs, function (err, appId) {
                if (err) {
                    return doneExecute(err);
                }
                assert.strictEqual(appId, '1', 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});