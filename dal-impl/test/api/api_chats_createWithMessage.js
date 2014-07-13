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
        newChat: {
            id: override.chatId === undefined ? '1000' : override.chatId,
            appId: override.appId === undefined ? '1' : override.appId,
            userCreatorId: override.userCreatorId === undefined ? '2' : override.userCreatorId,
            userCreatorType: override.userCreatorType === undefined ? 2 : override.userCreatorType,
            created: override.created === undefined ? new Date('2014-01-01 00:00:00') : override.created,
            title: override.title === undefined ? 'testChatName' : override.title,
            type: override.type === undefined ? 0 : override.type,
            status: override.status === undefined ? 0 : override.status,
            lastUpdate: override.lastUpdate === undefined ? new Date('2014-01-01 00:00:00') : override.lastUpdate,
            extra: {
                countryId: override.countryId === undefined ? 1 : override.countryId,
                langId: override.langId === undefined ? 1 : override.langId,
                api: override.api === undefined ? 1 : override.api,
                apiTextValue: override.apiTextValue === undefined ? '1' : override.apiTextValue,
                appBuild: override.appBuild === undefined ? 1 : override.appBuild,
                appVersion: override.appVersion === undefined ? '1' : override.appVersion,
                deviceManufacturer: override.deviceManufacturer === undefined ? 'testManufacturer' : override.deviceManufacturer,
                deviceModel: override.deviceModel === undefined ? 'testDeviceModel' : override.deviceModel,
                deviceWidthPx: override.deviceWidthPx === undefined ? 100 : override.deviceWidthPx,
                deviceHeightPx: override.deviceHeightPx === undefined ? 200 : override.deviceHeightPx,
                deviceDensity: override.deviceDensity === undefined ? 300 : override.deviceDensity,
                isRooted: override.isRooted === undefined ? false : override.isRooted,
                metaData: override.metaData === undefined ? 'testMetaData' : override.metaData
            },
            participants: [
                {
                    userId: override.pUserId1 === undefined ? '2' : override.pUserId1,
                    userType: override.pUserType1 === undefined ? 2 : override.pUserType1
                },
                {
                    userId: override.pUserId2 === undefined ? '1' : override.pUserId2,
                    userType: override.pUserType2 === undefined ? 1 : override.pUserType2
                }
            ]
        },
        newMessage: {
            id: override.messageId === undefined ? '1000' : override.messageId,
            created: override.created === undefined ? new Date('2014-01-01 00:00:00') : override.created,
            content: override.content === undefined ? 'testMessage' : override.content,
            isRead: [
                {
                    userId: override.irUserId1 === undefined ? '2' : override.irUserId1,
                    userType: override.irUserType1 === undefined ? 2 : override.irUserType1,
                    isRead: override.irIsRead1 === undefined ? true : override.irIsRead1
                },
                {
                    userId: override.irUserId2 === undefined ? '1' : override.irUserId2,
                    userType: override.irUserType2 === undefined ? 1 : override.irUserType2,
                    isRead: override.irIsRead2 === undefined ? false : override.irIsRead2
                }
            ]
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


describe('DAL::chats_createWithMessage', function () {

    it('Must not pass invalid chat holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newChat;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat = null;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat = '1';
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
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
                    api.chats_createWithMessage(argsBuilder({chatId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({chatId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({chatId: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({chatId: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid appId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appId: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appId: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.chats_createWithMessage(argsBuilder({userCreatorId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({userCreatorId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({userCreatorId: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({userCreatorId: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.chats_createWithMessage(argsBuilder({userCreatorType: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({userCreatorType: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({userCreatorType: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.chats_createWithMessage(argsBuilder({created: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({created: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({created: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.chats_createWithMessage(argsBuilder({title: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({title: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({title: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid type', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({type: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({type: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({type: '1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid status', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({status: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({status: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({status: '1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid lastUpdate', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({lastUpdate: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({lastUpdate: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({lastUpdate: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid chat extra holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newChat.extra;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat.extra = null;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat.extra = '1';
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid countryId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({countryId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({countryId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({countryId: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid langId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({langId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({langId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({langId: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid api', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({api: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({api: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({api: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid apiTextValue', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({apiTextValue: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({apiTextValue: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({apiTextValue: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid appBuild', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appBuild: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appBuild: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appBuild: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid appVersion', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appVersion: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appVersion: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({appVersion: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid deviceManufacturer', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceManufacturer: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceManufacturer: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceManufacturer: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid deviceModel', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceModel: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceModel: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceModel: -1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid deviceWidthPx', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceWidthPx: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceWidthPx: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceWidthPx: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceWidthPx: 1000000}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid deviceHeightPx', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceHeightPx: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceHeightPx: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceHeightPx: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceHeightPx: 1000000}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid deviceDensity', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceDensity: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceDensity: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceDensity: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({deviceDensity: 1000000}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid isRooted', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({isRooted: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({isRooted: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({isRooted: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({isRooted: 1000000}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid metaData', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({metaData: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({metaData: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({metaData: 1000000}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid chat participants holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newChat.participants;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat.participants = null;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat.participants = '1';
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid chat participant userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({pUserId1: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({pUserId1: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({pUserId1: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({pUserId1: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid chat participant userType', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({pUserType1: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({pUserType1: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({pUserType1: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });


    it('Must not pass invalid message holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newMessage;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newMessage = null;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newMessage = '1';
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid message id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({messageId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({messageId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({messageId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({messageId: 1}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid message created', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({created: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({created: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({created: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must not pass invalid message content', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({content: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({content: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({content: 1}), invalidArgsCallbackEntry(cb));
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
                    delete reqArgs.newMessage.isRead;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newMessage.isRead = null;
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newMessage.isRead = '1';
                    api.chats_createWithMessage(reqArgs, invalidArgsCallbackEntry(cb));
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
                    api.chats_createWithMessage(argsBuilder({irUserId1: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({irUserId1: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({irUserId1: -1}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({irUserId1: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.chats_createWithMessage(argsBuilder({irUserType1: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({irUserType1: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({irUserType1: '-1'}), invalidArgsCallbackEntry(cb));
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
                    api.chats_createWithMessage(argsBuilder({irIsRead1: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({irIsRead1: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chats_createWithMessage(argsBuilder({irIsRead1: '-1'}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    // ==============================================================

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chats_createWithMessage(reqArgs, function (err, result) {
                if (err) {
                    return doneExecute(err);
                }
                assert.isNull(result);
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return just created chat', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgsCreate = argsBuilder();
            api.chats_createWithMessage(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    appId: reqArgsCreate.newChat.appId,
                    userCreatorId: reqArgsCreate.newChat.userCreatorId,
                    userCreatorType: reqArgsCreate.newChat.userCreatorType,
                    offset: -1,
                    limit: 50
                };
                api.chats_getListWithLastMessageOrderByLastMessageCreatedAscForUser(reqArgsGet, function (err, chats) {
                    if (err) {
                        return doneExecute(err);
                    }
                    assert.operator(chats.length, '>=', 1, 'Number of chats is 0');
                    assert.strictEqual(chats[0].id, reqArgsCreate.newChat.id, 'Just created chat is not accessible');
                    doneExecute();
                });
            });
        }, doneTest);
    });

});