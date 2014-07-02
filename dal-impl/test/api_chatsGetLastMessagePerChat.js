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
        chatIds: override.chatIds === undefined ? ['1', '2'] : override.chatIds
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


describe('DAL::chatsGetLastMessagePerChat', function () {

    it('Must not pass invalid chatIds', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatsGetLastMessagePerChat(argsBuilder({chatIds: {}}), cb);
                },
                function (cb) {
                    api.chatsGetLastMessagePerChat(argsBuilder({chatIds: null}), cb);
                },
                function (cb) {
                    api.chatsGetLastMessagePerChat(argsBuilder({chatIds: ['-1']}), cb);
                },
                function (cb) {
                    api.chatsGetLastMessagePerChat(argsBuilder({chatIds: [1]}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return error if some chat is not found', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatIds: ['1000']});
            api.chatsGetLastMessagePerChat(reqArgs, function (err, result) {
                if (err && err.number === dErr.CHAT_NOT_FOUND) {
                    doneExecute();
                } else if (err) {
                    doneExecute(err);
                } else {
                    doneExecute(new Error('The result was returned for non-existing chat'));
                }
            });
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chatsGetLastMessagePerChat(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }

                assert.isObject(result, 'Return result must be the object');
                assert.strictEqual(Object.keys(result).length, 2, 'Expected to receive 2 result items');
                assert.isDefined(result['1'], 'Expected to chat #1 be in result');
                assert.isDefined(result['2'], 'Expected to chat #2 be in result');

                var expected = {
                    id: '2',
                    chatId: '1',
                    userCreatorId: '1',
                    userCreatorType: 1,
                    created: new Date('2012-05-01 13:10:05 +00:00'),
                    content: 'I have answer #1'
                };
                assert.deepEqual(result['1'], expected, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});