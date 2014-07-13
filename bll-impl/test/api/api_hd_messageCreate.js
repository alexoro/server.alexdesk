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


var argsBuilder = function(override) {
    if (!override) {
        override = {};
    }
    return {
        accessToken: override.accessToken === undefined ? '142b2b49-75f2-456f-9533-435bd0ef94c0' : override.accessToken,
        chatId: override.chatId === undefined ? '1' : override.chatId,
        message: override.message === undefined ? 'Hey, this is message from test' : override.message
    };
};


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
        var args = argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'});
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
        var args = argsBuilder({accessToken: '390582c6-a59b-4ab2-a8e1-87fdbb291b97'});
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
        var fnStack = [
            function(cb) {
                api.hd_messageCreate(argsBuilder({chatId: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder({chatId: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder({chatId: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder({chatId: 'xxx@xx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                var chatId = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
                api.hd_messageCreate(argsBuilder({chatId: chatId}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder({chatId: '-1'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder({chatId: '1.0'}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: message type', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_messageCreate(argsBuilder({message: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder({message: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder({message: 1.1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messageCreate(argsBuilder({message: ''}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: very long message must not be passed', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_messageCreate(argsBuilder({message: new Array(10000).join('a')}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: too short message must not be passed', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_messageCreate(argsBuilder({message: 'x'}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Must return INTERNAL_ERROR in case of error in DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.authToken_getUserInfoByToken = function(args, done) {
            done(new Error('Not implemented yet'));
        };

        var api = mock.api;
        api.hd_messageCreate(argsBuilder(), function(err, result) {
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
        mock.dal.chatIsExists = function(args, done) {
            done(null, null);
        };

        var api = mock.api;
        api.hd_messageCreate(argsBuilder(), function(err, result) {
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

    // ==========================================================

    it('Must not allow not confirmed user to call this method', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.hd_messageCreate(argsBuilder({accessToken: 'b6e84344-74e0-43f3-83e0-6a16c3fe6b5d'}), function(err) {
            if (err && err.number === dErrors.USER_NOT_CONFIRMED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Not confirmed user did create the message');
                doneTest();
            }
        });
    });

    it('Check unknown chat for service user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({chatId: '10'});
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
        var reqArgs = argsBuilder({accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', chatId: '10'});
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
        var reqArgs = argsBuilder({chatId: '4'});
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
        var reqArgs = argsBuilder({accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', chatId: '3'});
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
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        var args = argsBuilder();
        api.hd_messageCreate(args, function(err, message) {
            if (err) {
                return doneTest(err);
            }

            var matchMessage = {
                id: '1000',
                chatId: '1',
                userCreatorId: '1',
                userCreatorType: domain.userTypes.SERVICE_USER,
                created: new Date('2014-05-15 00:00:00 +00:00'),
                content: args.message,
                isRead: true
            };

            assert.deepEqual(message, matchMessage, 'Expected message and received message are not match');
            doneTest();
        });
    });

    it('Message must be created for application user', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        var args = argsBuilder({accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a'});
        api.hd_messageCreate(args, function(err, message) {
            if (err) {
                return doneTest(err);
            }

            var matchMessage = {
                id: '1000',
                chatId: '1',
                userCreatorId: '2',
                userCreatorType: domain.userTypes.APP_USER,
                created: new Date('2014-05-15 00:00:00 +00:00'),
                content: args.message,
                isRead: true
            };

            assert.deepEqual(message, matchMessage, 'Expected message and received message are not match');
            doneTest();
        });
    });

    it('Created message must be created in storage', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        var api = mock.api;
        var args = argsBuilder();
        api.hd_messageCreate(args, function(err, matchMessage) {
            if (err) {
                return doneTest(err);
            }

            var argsList = {
                accessToken: args.accessToken,
                chatId: args.chatId,
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
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder();
        api.hd_messageCreate(reqArgs, function(err, message) {
            if (err) {
                return doneTest(err);
            } else if (!message) {
                return doneTest(new Error('Message did not created'));
            }

            var argsList = {
                accessToken: reqArgs.accessToken,
                chatId: reqArgs.chatId
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
        var reqArgs = argsBuilder();
        api.hd_messageCreate(reqArgs, function(err, message) {
            if (err) {
                return doneTest(err);
            } else if (!message) {
                return doneTest(new Error('Message did not created'));
            }

            var argsList = {
                accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a',
                chatId: reqArgs.chatId,
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

});