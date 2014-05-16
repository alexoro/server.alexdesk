/**
 * Created by UAS on 16.05.2014.
 */

"use strict";

var assert = require('chai').assert;
var async = require('async');

var domain = require('../../').domain;
var dErrors = domain.errors;

var mockBuilder = require('./mock/');


var invalidArgsCb = function(cb) {
    return function(err) {
        if (err && err.number && err.number === dErrors.INVALID_PARAMS) {
            cb();
        } else if (err) {
            cb(err);
        } else {
            cb(new Error('Application passed some invalid argument'));
        }
    };
};

var argsBuilder = function(override) {
    return {
        accessToken: override.accessToken || '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a',
        appId: override.appId || '1',

        platform: override.platform || domain.platform.ANDROID,
        country: override.country || '',
        lang: override.langId || '',
        api: override.api || 10,
        apiTextValue: override.apiTextValue || 'Gingerbird',
        appBuild: override.appBuild || 1,
        appVersion: override.appVersion || '1.0',
        deviceManufacturer: override.deviceManufacturer || 'Samsung',
        deviceModel: override.deviceModel || 'S5',
        deviceWidthPx: override.deviceWidthPx || 1280,
        deviceHeightPx: override.deviceHeightPx || 1920,
        deviceDensity: override.deviceDensity || 320,
        isRooted: override.isRooted || false,
        metaData: override.metaData || '',

        message: override.message || 'The is a message from test create chat'
    };
};


describe('API#hd_chatCreate', function() {

    it.only('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Check invalid access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.hd_chatCreate(argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'}), function(err, result) {
            if (err.number && err.number === dErrors.INVALID_PARAMS) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Invalid token was processed as valid');
                doneTest();
            }
        });
    });

    it('Check expired access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.hd_chatCreate(argsBuilder({accessToken: '390582c6-a59b-4ab2-a8e1-87fdbb291b97'}), function(err, result) {
            if (err && err.number === dErrors.INVALID_OR_EXPIRED_TOKEN) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Expired access token was processed as valid');
                doneTest();
            }
        });
    });

    it('Validate invalid arguments: app id is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatsList(argsBuilder({appId: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({appId: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({appId: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({appId: 1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({appId: 'xxx@xx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({appId: '-1'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({appId: '1.0'}), invalidArgsCb(cb));
            },
            function(cb) {
                var appId = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
                api.hd_chatsList(argsBuilder({appId: appId}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: message type', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({message: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({message: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({message: 1.1}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: very long message must not be passed', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                var part = '0123456789';
                var veryLongMessage = '';
                for (var i = 0; i < 10000; i++) {
                    veryLongMessage += part;
                }
                api.hd_chatCreate(argsBuilder({message: veryLongMessage}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: too short message must not be passed', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({message: 'x'}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: platform', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({platform: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({platform: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({platform: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({platform: 100}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: country', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({country: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({country: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({country: 4}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({lang: 'xyz'}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: language', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({lang: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({lang: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({lang: 4}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({lang: 'xyz'}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: api', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({api: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({api: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({api: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({api: -1}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: apiTextValue', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({apiTextValue: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({apiTextValue: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({apiTextValue: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                var veryLong = new Array(100).join("a");
                api.hd_chatCreate(argsBuilder({apiTextValue: veryLong}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: appBuild', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({appBuild: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({appBuild: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({appBuild: '1'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({appBuild: -1}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: appVersion', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({appVersion: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({appVersion: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({appVersion: 1}), invalidArgsCb(cb));
            },
            function(cb) {
                var veryLong = new Array(100).join("a");
                api.hd_chatCreate(argsBuilder({appVersion: veryLong}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: deviceManufacturer', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceManufacturer: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceManufacturer: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceManufacturer: 1}), invalidArgsCb(cb));
            },
            function(cb) {
                var veryLong = new Array(100).join("a");
                api.hd_chatCreate(argsBuilder({deviceManufacturer: veryLong}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: deviceModel', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceModel: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceModel: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceModel: 1}), invalidArgsCb(cb));
            },
            function(cb) {
                var veryLong = new Array(100).join("a");
                api.hd_chatCreate(argsBuilder({deviceModel: veryLong}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: deviceWidthPx', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceWidthPx: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceWidthPx: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceWidthPx: '1'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceWidthPx: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceWidthPx: 40000}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: deviceHeightPx', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceHeightPx: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceHeightPx: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceHeightPx: '1'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceHeightPx: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceHeightPx: 40000}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: deviceDensity', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceDensity: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceDensity: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceDensity: '1'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceDensity: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({deviceDensity: 40000}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: isRooted', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({isRooted: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({isRooted: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({isRooted: '1'}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: metaData', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatCreate(argsBuilder({metaData: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({metaData: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatCreate(argsBuilder({metaData: 1}), invalidArgsCb(cb));
            },
            function(cb) {
                var veryLong = new Array(10000).join("a");
                api.hd_chatCreate(argsBuilder({metaData: veryLong}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Must return INTERNAL_ERROR in case of error in DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.isAppExists = function(args, done) {
            done(new Error('Not implemented yet'));
        };

        var api = mock.api;
        var reqArgs = argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0'});
        api.hd_chatCreate(reqArgs, function(err) {
            if (err && err.number && err.number === dErrors.INTERNAL_ERROR) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return INTERNAL_ERROR for error in DAL');
                doneTest();
            }
        });
    });

    it('Must return INTERNAL_ERROR in case of invalid response from DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.isAppExists = function(args, done) {
            done(null, null);
        };

        var api = mock.api;
        var reqArgs = argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0'});
        api.hd_chatCreate(reqArgs, function(err) {
            if (err && err.number && err.number === dErrors.INTERNAL_ERROR) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return INTERNAL_ERROR for invalid response from DAL');
                doneTest();
            }
        });
    });

    // =========================================================

    it('Check unknown application for service user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0', appId: '10'});
        api.hd_chatsList(reqArgs, function(err) {
            if (err && err.number && err.number === dErrors.APP_NOT_FOUND) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return APP_NOT_FOUND for unknown application');
                doneTest();
            }
        });
    });

    it('Check unknown application for application user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', appId: '10'});
        api.hd_chatsList(reqArgs, function(err) {
            if (err && err.number && err.number === dErrors.APP_NOT_FOUND) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return APP_NOT_FOUND for unknown application');
                doneTest();
            }
        });
    });

    it('Check access to application for service user that is not associated with him', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0', appId: '2'});
        api.hd_chatsList(reqArgs, function(err) {
            if (err && err.number && err.number === dErrors.ACCESS_DENIED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return ACCESS_DENIED for application that not belongs to service user');
                doneTest();
            }
        });
    });

    it('Check access to application for app user that is not associated with him', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', appId: '2'});
        api.hd_chatsList(reqArgs, function(err) {
            if (err && err.number && err.number === dErrors.ACCESS_DENIED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return ACCESS_DENIED for application that not belongs to app user');
                doneTest();
            }
        });
    });

    // =========================================================

    it('Chat must not be created for service user', function(doneTest) {
        var currentTime = new Date('2014-05-20 00:00:00 +00:00');
        var idForMessage = '500';

        var currentTimeProvider = {
            getCurrentTime: function(done) {
                done(null, currentTime);
            }
        };

        var uuid = {
            newBigInt: function(done) {
                done(null, idForMessage);
            },
            newGuid4: function(done) {
                done(new Error('Not implemented'));
            }
        };

        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';

        var mock = mockBuilder.newApiWithMock({currentTimeProvider: currentTimeProvider, uuid: uuid});
        var api = mock.api;
        var args = argsBuilder({accessToken: token});
        api.hd_chatCreate(args, function(err) {
            if (err && err.number === dErrors.LOGIC_ERROR) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Chat was created for service user');
                doneTest();
            }
        });
    });

    it('Chat must be created for application user', function(doneTest) {
        var currentTime = new Date('2014-05-20 00:00:00 +00:00');
        var idForMessage = '500';

        var currentTimeProvider = {
            getCurrentTime: function(done) {
                done(null, currentTime);
            }
        };

        var uuid = {
            newBigInt: function(done) {
                done(null, idForMessage);
            },
            newGuid4: function(done) {
                done(new Error('Not implemented'));
            }
        };

        var token = '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a';

        var mock = mockBuilder.newApiWithMock({currentTimeProvider: currentTimeProvider, uuid: uuid});
        var api = mock.api;
        var args = argsBuilder({accessToken: token});
        api.hd_chatCreate(args, function(err, chat) {
            if (err) {
                return doneTest(err);
            }

            var matchChat = {
                id: idForMessage,
                appId: args.appId,
                userCreatorId: '2',
                userCreatorType: domain.userTypes.APP_USER,
                created: currentTime,
                title: '',
                type: domain.chatTypes.UNKNOWN,
                status: domain.chatStatuses.UNKNOWN,
                lastUpdate: currentTime,
                platform: args.platform,
                extra: {
                    countryId: domain.countries.ID_FOR_UNKNOWN_CODE,
                    langId: domain.languages.ID_FOR_UNKNOWN_CODE,
                    api: args.api,
                    apiTextValue: args.apiTextValue,
                    appBuild: args.appBuild,
                    appVersion: args.appVersion,
                    deviceManufacturer: args.deviceManufacturer,
                    deviceModel: args.deviceModel,
                    deviceWidthPx: args.deviceWidthPx,
                    deviceHeightPx: args.deviceHeightPx,
                    deviceDensity: args.deviceDensity,
                    isRooted: args.isRooted,
                    metaData: args.metaData
                }
            };

            var matchMessage = {
                id: idForMessage,
                userCreatorId: '2',
                userCreatorType: domain.userTypes.APP_USER,
                created: currentTime,
                content: args.message,
                isRead: true
            };
            var messageFromResponse = chat.message;

            delete chat.message;
            assert.deepEqual(chat, matchChat, 'Expected chat and created chat are not match');
            assert.deepEqual(messageFromResponse, matchMessage, 'Expected message and created message are not match');

            doneTest();
        });
    });

    it('Message must be created in storage', function(doneTest) {
        var currentTime = new Date('2014-05-20 00:00:00 +00:00');
        var idForMessage = '500';

        var currentTimeProvider = {
            getCurrentTime: function(done) {
                done(null, currentTime);
            }
        };

        var uuid = {
            newBigInt: function(done) {
                done(null, idForMessage);
            },
            newGuid4: function(done) {
                done(new Error('Not implemented'));
            }
        };

        var token = '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a';

        var mock = mockBuilder.newApiWithMock({currentTimeProvider: currentTimeProvider, uuid: uuid});
        var api = mock.api;
        var args = argsBuilder({accessToken: token});
        api.hd_chatCreate(args, function(err, chat) {
            if (err) {
                return doneTest(err);
            }

            var messagesListArgs = {
                accessToken: token, chatId: chat.id
            };
            api.hd_messagesList(messagesListArgs, function(err, messages) {
                if (err) {
                    return doneTest(err);
                }
                assert.lengthOf(messages, 1, 'Only 1 message must be created');
                doneTest();
            });
        });
    });

    it('New message for another user after create must be unread', function(doneTest) {
        var currentTime = new Date('2014-05-20 00:00:00 +00:00');
        var idForMessage = '500';

        var currentTimeProvider = {
            getCurrentTime: function(done) {
                done(null, currentTime);
            }
        };

        var uuid = {
            newBigInt: function(done) {
                done(null, idForMessage);
            },
            newGuid4: function(done) {
                done(new Error('Not implemented'));
            }
        };

        var token = '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a';

        var mock = mockBuilder.newApiWithMock({currentTimeProvider: currentTimeProvider, uuid: uuid});
        var api = mock.api;
        var args = argsBuilder({accessToken: token});
        api.hd_chatCreate(args, function(err, chat) {
            if (err) {
                return doneTest(err);
            }

            var messagesListArgs = {
                accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0', chatId: chat.id, offset: -1
            };
            api.hd_messagesList(messagesListArgs, function(err, messages) {
                if (err) {
                    doneTest(err);
                } else if (!messages || messages.length !== 1) {
                    doneTest(new Error('Created message (via new chat) is not accessible or messages list is greater than 1'));
                } else {
                    assert.notOk(messages[0].isRead, 'Message for another user must be marked as unread');
                    doneTest();
                }
            });
        });
    });

    it('Message must be escaped', function(doneTest) {
        var token = '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a';
        var message = '<a href="xas">Ololo</a>';

        var api = mockBuilder.newApiWithMock().api;
        api.hd_chatCreate(argsBuilder({accessToken: token, message: message}), function(err, chat) {
            if (err) {
                return doneTest(err);
            } else if (!message) {
                return doneTest(new Error('Chat did not created'));
            }

            assert.equal(chat.message.content, '&lt;a href&#61;&#34;xas&#34;&gt;Ololo&lt;/a&gt;', 'Message have not been escaped');
            doneTest();
        });
    });

});