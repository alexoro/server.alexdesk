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
        chatId: override.chatId === undefined ? '1' : override.chatId,
        offset: override.offset === undefined ? 0 : override.offset,
        limit: override.limit === undefined ? 50 : override.limit
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


describe('DAL::messagesGetListForChatOrderByCreatedAsc', function () {

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({chatId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({chatId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({chatId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({chatId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid offset', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({offset: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({offset: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({offset: '1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid limit', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({limit: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({limit: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({limit: '1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messagesGetListForChatOrderByCreatedAsc(argsBuilder({limit: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return empty array if chat not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatId: '1000'});
            api.messagesGetListForChatOrderByCreatedAsc(reqArgs, function (err, messages) {
                if (err) {
                    return doneExecute(err);
                }
                assert.lengthOf(messages, 0, 'Expected to receive 0 results');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.messagesGetListForChatOrderByCreatedAsc(reqArgs, function (err, messages) {
                if (err) {
                    return doneExecute(err);
                }

                var expected = {
                    id: '1',
                    chatId: '1',
                    userCreatorId: '2',
                    userCreatorType: 2,
                    created: new Date('2012-05-01 13:10:00 +00:00'),
                    content: 'I have question #1'
                };

                assert.lengthOf(messages, 2, 'Expected to receive 2 results');
                assert.deepEqual(messages[0], expected, 'Expected and actual results are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result with offset', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({offset: 1});
            api.messagesGetListForChatOrderByCreatedAsc(reqArgs, function (err, messages) {
                if (err) {
                    return doneExecute(err);
                }
                assert.lengthOf(messages, 1, 'Expected to receive 1 result');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result with negative offset', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({offset: -1});
            api.messagesGetListForChatOrderByCreatedAsc(reqArgs, function (err, messages) {
                if (err) {
                    return doneExecute(err);
                }
                assert.lengthOf(messages, 1, 'Expected to receive 1 result');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result with limit', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({limit: 1});
            api.messagesGetListForChatOrderByCreatedAsc(reqArgs, function (err, messages) {
                if (err) {
                    return doneExecute(err);
                }

                var expected = {
                    id: '1',
                    chatId: '1',
                    userCreatorId: '2',
                    userCreatorType: 2,
                    created: new Date('2012-05-01 13:10:00 +00:00'),
                    content: 'I have question #1'
                };

                assert.lengthOf(messages, 1, 'Expected to receive 1 result');
                assert.deepEqual(messages[0], expected, 'Expected and actual results are not match');
                doneExecute();
            });
        }, doneTest);
    });

});