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


describe('DAL::chatCreateWithMessage', function () {

    it('Must not pass invalid chat holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newChat;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat = null;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat = '1';
                    api.chatCreateWithMessage(reqArgs, cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid chatId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({chatId: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({chatId: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({chatId: -1}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({chatId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid appId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appId: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appId: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appId: -1}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid userCreatorId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({userCreatorId: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({userCreatorId: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({userCreatorId: -1}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({userCreatorId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid userCreatorType', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({userCreatorType: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({userCreatorType: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({userCreatorType: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid created', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({created: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({created: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({created: '-1'}), cb);
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
                    api.chatCreateWithMessage(argsBuilder({title: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({title: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({title: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid type', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({type: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({type: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({type: '1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid status', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({status: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({status: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({status: '1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid lastUpdate', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({lastUpdate: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({lastUpdate: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({lastUpdate: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid chat extra holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newChat.extra;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat.extra = null;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat.extra = '1';
                    api.chatCreateWithMessage(reqArgs, cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid countryId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({countryId: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({countryId: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({countryId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid langId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({langId: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({langId: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({langId: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid api', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({api: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({api: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({api: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid apiTextValue', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({apiTextValue: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({apiTextValue: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({apiTextValue: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid appBuild', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appBuild: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appBuild: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appBuild: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid appVersion', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appVersion: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appVersion: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({appVersion: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid deviceManufacturer', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceManufacturer: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceManufacturer: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceManufacturer: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid deviceModel', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceModel: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceModel: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceModel: -1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid deviceWidthPx', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceWidthPx: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceWidthPx: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceWidthPx: '-1'}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceWidthPx: 1000000}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid deviceHeightPx', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceHeightPx: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceHeightPx: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceHeightPx: '-1'}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceHeightPx: 1000000}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid deviceDensity', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceDensity: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceDensity: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceDensity: '-1'}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({deviceDensity: 1000000}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid isRooted', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({isRooted: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({isRooted: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({isRooted: '-1'}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({isRooted: 1000000}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid metaData', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({metaData: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({metaData: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({metaData: 1000000}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid chat participants holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newChat.participants;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat.participants = null;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newChat.participants = '1';
                    api.chatCreateWithMessage(reqArgs, cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid chat participant userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({pUserId1: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({pUserId1: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({pUserId1: -1}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({pUserId1: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid chat participant userType', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({pUserType1: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({pUserType1: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({pUserType1: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });


    it('Must not pass invalid message holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newMessage;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newMessage = null;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newMessage = '1';
                    api.chatCreateWithMessage(reqArgs, cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid message id', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({messageId: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({messageId: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({messageId: '-1'}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({messageId: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid message created', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({created: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({created: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({created: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid message content', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({content: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({content: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({content: 1}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid message isRead holder', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    var reqArgs = argsBuilder();
                    delete reqArgs.newMessage.isRead;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newMessage.isRead = null;
                    api.chatCreateWithMessage(reqArgs, cb);
                },
                function (cb) {
                    var reqArgs = argsBuilder();
                    reqArgs.newMessage.isRead = '1';
                    api.chatCreateWithMessage(reqArgs, cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid message isRead userId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({irUserId1: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({irUserId1: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({irUserId1: -1}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({irUserId1: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid message isRead userType', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({irUserType1: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({irUserType1: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({irUserType1: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    it('Must not pass invalid message isRead isRead', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({isRead: {}}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({isRead: null}), cb);
                },
                function (cb) {
                    api.chatCreateWithMessage(argsBuilder({isRead: '-1'}), cb);
                }
            ];
            async.series(fnStack, invalidArgsCallback(doneExecute));
        }, doneTest);
    });

    // ==============================================================

    it('Must return valid result', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chatCreateWithMessage(reqArgs, function (err, result) {
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
            api.chatCreateWithMessage(reqArgsCreate, function (err) {
                if (err) {
                    return doneExecute(err);
                }

                var reqArgsGet = {
                    appId: reqArgsCreate.appId,
                    userCreatorId: reqArgsCreate.userCreatorId
                };
                api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(reqArgsGet, function (err, chats) {
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