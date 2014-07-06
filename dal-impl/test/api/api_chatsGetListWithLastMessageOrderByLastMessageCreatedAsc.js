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
        appId: override.appId === undefined ? '1' : override.appId,
        userCreatorId: override.userCreatorId === undefined ? '2' : override.userCreatorId,
        limit: override.limit === undefined ? 50 : override.limit,
        offset: override.offset === undefined ? 0 : override.offset
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


describe('DAL::chatsGetListWithLastMessageOrderByLastMessageCreatedAsc', function () {

    it('Must not pass invalid appId', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var fnStack = [
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({appId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({appId: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({appId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({appId: 1}), invalidArgsCallbackEntry(cb));
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
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({userCreatorId: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({userCreatorId: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({userCreatorId: 1}), invalidArgsCallbackEntry(cb));
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
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({limit: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({limit: null}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({limit: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({limit: -1}), invalidArgsCallbackEntry(cb));
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
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({offset: {}}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({offset: '-1'}), invalidArgsCallbackEntry(cb));
                },
                function (cb) {
                    api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(argsBuilder({offset: null}), invalidArgsCallbackEntry(cb));
                }
            ];
            async.series(fnStack, doneExecute);
        }, doneTest);
    });

    it('Must return error if app is not found', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({appId: '1000'});
            api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(reqArgs, function (err, isCreator) {
                if (err && err.number === dErr.APP_IS_NOT_FOUND) {
                    doneExecute();
                } else if (err) {
                    doneExecute(err);
                } else {
                    doneExecute(new Error('Result was returned for non-existing app'));
                }
            });
        }, doneTest);
    });

    it('Must return valid result for specified app', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({userCreatorId: null});
            api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(reqArgs, function (err, chats) {
                if (err) {
                    return doneExecute(err);
                }

                var expected = {
                    id: '1',
                    appId: '1',
                    userCreatorId: '2',
                    userCreatorType: 2,
                    created: new Date('2012-05-01 13:20:00 +00:00'),
                    title: '',
                    type: 0,
                    status: 0,
                    extra: {
                        countryId: 170,
                        langId: 134,
                        api: 10,
                        apiTextValue: 'Gingerbird',
                        appBuild: 1,
                        appVersion: '1.0',
                        deviceManufacturer: 'Samsung',
                        deviceModel: 'S5',
                        deviceWidthPx: 1280,
                        deviceHeightPx: 1920,
                        deviceDensity: 320,
                        isRooted: false,
                        metaData: ''
                    },
                    lastMessage: {
                        id: '2',
                        chatId: '1',
                        userCreatorId: '1',
                        userCreatorType: 1,
                        created: new Date('2012-05-01 13:10:05 +00:00'),
                        content: 'I have answer #1'
                    }
                };

                assert.lengthOf(chats, 3, 'Expected to received 3 chats');
                assert.deepEqual(chats[0], expected, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result for specified app and user', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder();
            api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(reqArgs, function (err, chats) {
                if (err) {
                    return doneExecute(err);
                }

                var expected = {
                    id: '1',
                    appId: '1',
                    userCreatorId: '2',
                    userCreatorType: 2,
                    created: new Date('2012-05-01 13:20:00 +00:00'),
                    title: '',
                    type: 0,
                    status: 0,
                    extra: {
                        countryId: 170,
                        langId: 134,
                        api: 10,
                        apiTextValue: 'Gingerbird',
                        appBuild: 1,
                        appVersion: '1.0',
                        deviceManufacturer: 'Samsung',
                        deviceModel: 'S5',
                        deviceWidthPx: 1280,
                        deviceHeightPx: 1920,
                        deviceDensity: 320,
                        isRooted: false,
                        metaData: ''
                    },
                    lastMessage: {
                        id: '2',
                        chatId: '1',
                        userCreatorId: '1',
                        userCreatorType: 1,
                        created: new Date('2012-05-01 13:10:05 +00:00'),
                        content: 'I have answer #1'
                    }
                };

                assert.lengthOf(chats, 2, 'Expected to received 2 chats');
                assert.deepEqual(chats[0], expected, 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result for specified app with limit', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({userCreatorId: null, limit: 1});
            api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(reqArgs, function (err, chats) {
                if (err) {
                    return doneExecute(err);
                }

                assert.lengthOf(chats, 1, 'Expected to received 1 chat');
                assert.strictEqual(chats[0].id, '1', 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result for specified app with offset', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({userCreatorId: null, offset: 1});
            api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(reqArgs, function (err, chats) {
                if (err) {
                    return doneExecute(err);
                }

                assert.lengthOf(chats, 2, 'Expected to received 2 chats');
                assert.strictEqual(chats[0].id, '2', 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result for specified app with offset and limit', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({userCreatorId: null, offset: 1, limit: 1});
            api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(reqArgs, function (err, chats) {
                if (err) {
                    return doneExecute(err);
                }

                assert.lengthOf(chats, 1, 'Expected to received 1 chat');
                assert.strictEqual(chats[0].id, '2', 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

    it('Must return valid result for specified app with negative offset', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            var reqArgs = argsBuilder({userCreatorId: null, offset: -1});
            api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc(reqArgs, function (err, chats) {
                if (err) {
                    return doneExecute(err);
                }

                assert.lengthOf(chats, 1, 'Expected to received 1 chat');
                assert.strictEqual(chats[0].id, '3', 'Expected and received result are not match');
                doneExecute();
            });
        }, doneTest);
    });

});