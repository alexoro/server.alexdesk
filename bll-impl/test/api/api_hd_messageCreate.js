/**
 * Created by UAS on 15.05.2014.
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


var argsBuilder = function(accessToken, chatId, message) {
    return {
        accessToken: accessToken, chatId: chatId, message: message
    };
};
var validChatId = '1';
var validMessage = 'Hey, this is message from test';


describe('API#hd_messageCreate', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_messageCreate(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(new Date(), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Check invalid access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0!!', validChatId, validMessage);
        api.hd_messageCreate(args, function(err, result) {
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
        var args = argsBuilder('390582c6-a59b-4ab2-a8e1-87fdbb291b97', validChatId, validMessage);
        api.hd_messageCreate(args, function(err, result) {
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

    it('Validate invalid arguments: chat id is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
        var fnStack = [
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, null, validMessage), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, {}, validMessage), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, '', validMessage), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, 'xxx@xx:com', validMessage), invalidArgsCb(cb));
            },
            function(cb) {
                var chatId = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
                api.hd_messageCreate(argsBuilder(token, chatId, validMessage), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, '-1', validMessage), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, '1.0', validMessage), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: message type', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
        var fnStack = [
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, validChatId, null), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, validChatId, {}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, validChatId, 1.1), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, validChatId, ''), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: very long message must not be passed', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
        var fnStack = [
            function(cb) {
                var part = '0123456789';
                var veryLongMessage = '';
                for (var i = 0; i < 10000; i++) {
                    veryLongMessage += part;
                }
                api.hd_messageCreate(argsBuilder(token, validChatId, veryLongMessage), invalidArgsCb(cb));
            },
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: too short message must not be passed', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
        var fnStack = [
            function(cb) {
                api.hd_messageCreate(argsBuilder(token, validChatId, 'x'), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Must return INTERNAL_ERROR in case of error in DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.getUserMainInfoByToken = function(args, done) {
            done(new Error('Not implemented yet'));
        };

        var api = mock.api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', validChatId, validMessage);
        api.hd_messageCreate(reqArgs, function(err, result) {
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
        mock.dal.isChatExists = function(args, done) {
            done(null, null);
        };

        var api = mock.api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', validChatId, validMessage);
        api.hd_messageCreate(reqArgs, function(err, result) {
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

    it('Check unknown chat for service user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '10', validMessage);
        api.hd_messageCreate(reqArgs, function(err, result) {
            if (err && err.number && err.number === dErrors.CHAT_NOT_FOUND) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return APP_NOT_FOUND for unknown application');
                doneTest();
            }
        });
    });

    it('Check unknown chat for application user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', '10', validMessage);
        api.hd_messageCreate(reqArgs, function(err, result) {
            if (err && err.number && err.number === dErrors.CHAT_NOT_FOUND) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return APP_NOT_FOUND for unknown application');
                doneTest();
            }
        });
    });

    it('Check access to chat for service user that is not associated with him', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '4', validMessage);
        api.hd_messageCreate(reqArgs, function(err, result) {
            if (err && err.number && err.number === dErrors.ACCESS_DENIED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return ACCESS_DENIED for chat that not belongs to service user');
                doneTest();
            }
        });
    });

    it('Check access to chat for app user that is not associated with him', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', '3', validMessage);
        api.hd_messageCreate(reqArgs, function(err, result) {
            if (err && err.number && err.number === dErrors.ACCESS_DENIED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Must return ACCESS_DENIED for chat that not belongs to app user');
                doneTest();
            }
        });
    });

    it('Message must be created for service user', function(doneTest) {
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
        var args = argsBuilder(token, validChatId, validMessage);
        api.hd_messageCreate(args, function(err, message) {
            if (err) {
                return doneTest(err);
            }

            var matchMessage = {
                id: idForMessage,
                userCreatorId: '1',
                userCreatorType: domain.userTypes.SERVICE_USER,
                created: currentTime,
                content: validMessage,
                isRead: true
            };

            assert.deepEqual(message, matchMessage, 'Expected message and received message are not match');
            doneTest();
        });
    });

    it('Message must be created for application user', function(doneTest) {
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
        var args = argsBuilder(token, validChatId, validMessage);
        api.hd_messageCreate(args, function(err, message) {
            if (err) {
                return doneTest(err);
            }

            var matchMessage = {
                id: idForMessage,
                userCreatorId: '2',
                userCreatorType: domain.userTypes.APP_USER,
                created: currentTime,
                content: validMessage,
                isRead: true
            };

            assert.deepEqual(message, matchMessage, 'Expected message and received message are not match');
            doneTest();
        });
    });

    it('Created message must be created in storage', function(doneTest) {
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
                done(new Error('Not implememnted'));
            }
        };

        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';

        var mock = mockBuilder.newApiWithMock({currentTimeProvider: currentTimeProvider, uuid: uuid});
        var api = mock.api;
        var args = argsBuilder(token, validChatId, validMessage);
        api.hd_messageCreate(args, function(err, matchMessage) {
            if (err) {
                return doneTest(err);
            }

            var argsList = {
                accessToken: token,
                chatId: validChatId,
                offset: -1
            };
            api.hd_messagesList(argsList, function(err, lastMessage) {
                if (err) {
                    return doneTest(err);
                }
                assert.deepEqual(lastMessage[0], matchMessage, 'Expected message and received message are not match');
                doneTest();
            });
        });
    });

    it('All messages must become read after calling this method', function(doneTest) {
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder(token, validChatId, validMessage);
        api.hd_messageCreate(reqArgs, function(err, message) {
            if (err) {
                return doneTest(err);
            } else if (!message) {
                return doneTest(new Error('Message did not created'));
            }

            var argsList = {
                accessToken: token,
                chatId: validChatId
            };
            api.hd_messagesList(argsList, function(err, result) {
                if (err) {
                    return doneTest(err);
                }

                var allIsRead = true;
                for (var i = 0; i < result.length; i++) {
                    allIsRead = allIsRead && result[i].isRead;
                }
                if (!allIsRead) {
                    assert.fail('All messages for specified user must become read after calling this method');
                }
                doneTest();
            });
        });
    });

    it('Last message for another user after create must be unread', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', validChatId, validMessage);
        api.hd_messageCreate(reqArgs, function(err, message) {
            if (err) {
                return doneTest(err);
            } else if (!message) {
                return doneTest(new Error('Message did not created'));
            }

            var argsList = {
                accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a',
                chatId: validChatId,
                offset: -1
            };
            api.hd_messagesList(argsList, function(err, result) {
                if (err) {
                    return doneTest(err);
                }

                assert.notOk(result[0].isRead, 'Last message for another user after create must be unread');
                doneTest();
            });
        });
    });

    it('Message must be escaped', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', validChatId, '<a href="xas">Ololo</a>');
        api.hd_messageCreate(reqArgs, function(err, message) {
            if (err) {
                return doneTest(err);
            } else if (!message) {
                return doneTest(new Error('Message did not created'));
            }

            assert.equal(message.content, '&lt;a href&#61;&#34;xas&#34;&gt;Ololo&lt;/a&gt;', 'Message have not been escaped');
            doneTest();
        });
    });

});