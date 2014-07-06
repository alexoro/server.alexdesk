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
        chatId: override.chatId === undefined ? '1' : override.chatId,
        userCreatorId: override.userCreatorId === undefined ? '1' : override.userCreatorId,
        userCreatorType: override.userCreatorType === undefined ? '1' : override.userCreatorType,
        created: override.created === undefined ? '1' : override.created,
        content: override.content === undefined ? '1' : override.content,
        isRead: [
            {
                userType: override.irUserType1 === undefined ? '1' : override.irUserType1,
                userId: override.irUserId1 === undefined ? '1' : override.irUserId1,
                isRead: override.irIsRead1 === undefined ? '1' : override.irIsRead1
            },
            {
                userType: override.irUserType2 === undefined ? '1' : override.irUserType2,
                userId: override.irUserId2 === undefined ? '1' : override.irUserId2,
                isRead: override.irIsRead2 === undefined ? '1' : override.irIsRead2
            }
        ]
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


describe('DAL::messageCreate', function () {

    it('Must not pass invalid id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({id: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({id: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({id: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({id: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({chatId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({chatId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({chatId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({chatId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid userCreatorId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({userCreatorId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({userCreatorId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({userCreatorId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({userCreatorId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid userCreatorType', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({userCreatorType: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({userCreatorType: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({userCreatorType: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({userCreatorType: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid created', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({created: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({created: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({created: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid content', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({content: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({content: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({content: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid message isRead holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.isRead;
                    api.messageCreate(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.isRead = null;
                    api.messageCreate(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.isRead = '1';
                    api.messageCreate(reqArgs, invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid message isRead userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({irUserId1: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({irUserId1: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({irUserId1: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({irUserId1: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid message isRead userType', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({irUserType1: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({irUserType1: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({irUserType1: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid message isRead isRead', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.messageCreate(argsBuilder({isRead: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({isRead: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.messageCreate(argsBuilder({isRead: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });
    
    // =================================================================

    it('Must return error if chat not exists', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatId: '1000'});
            api.messageCreate(reqArgs, function (err, result) {
                if (err && err.number === dErr.CHAT_NOT_FOUND) {
                    doneExecute();
                } else if (err) {
                    doneExecute(err);
                } else {
                    doneExecute(new Error('Method was executed successfully with non-existing chat'));
                }
            });
        }, doneTest);
    });

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({chatId: '1000'});
            api.messageCreate(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});