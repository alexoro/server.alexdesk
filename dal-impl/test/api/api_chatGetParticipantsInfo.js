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
        if (err && err.number === dErr.INVALID_PARAMS) {
            done();
        } else if (err) {
            done(err);
        } else {
            done(new Error('Application was created with invalid param'));
        }
    };
};


describe('DAL::chatGetParticipantsInfo', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatGetParticipantsInfo(argsBuilder({chatId: {}}), cb);
                },
                function (cb) {
                    api.chatGetParticipantsInfo(argsBuilder({chatId: null}), cb);
                },
                function (cb) {
                    api.chatGetParticipantsInfo(argsBuilder({chatId: '-1'}), cb);
                },
                function (cb) {
                    api.chatGetParticipantsInfo(argsBuilder({chatId: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chatGetParticipantsInfo(reqArgs, function (err, participants) {
                if (err) {
                    return doneExecute(err);
                }
                var expected = [
                    {
                        id: '1',
                        type: 1
                    },
                    {
                        id: '2',
                        type: 2
                    }
                ];
                assert.deepEqual(expected, participants, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});