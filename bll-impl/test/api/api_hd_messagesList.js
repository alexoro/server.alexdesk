/**
 * Created by UAS on 11.05.2014.
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
        offset: override.offset === undefined ? 0 : override.offset,
        limit: override.limit === undefined ? 50 : override.limit
    };
};


describe('API#hd_messagesList', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_messagesList(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList({}, invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Check invalid access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'});
        api.hd_messagesList(args, function(err, result) {
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
        api.hd_messagesList(args, function(err, result) {
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
                api.hd_messagesList(argsBuilder({chatId: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({chatId: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({chatId: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({chatId: 'xxx@xx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                var chatId = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
                api.hd_messagesList(argsBuilder({chatId: chatId}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({chatId: '-1'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({chatId: '1.0'}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: offset is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_messagesList(argsBuilder({offset: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({offset: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({offset: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({offset: 'xxx@xx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({offset: 1.1}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: limit is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_messagesList(argsBuilder({limit: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({limit: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({limit: 'xxx@xx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({limit: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({limit: 100}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_messagesList(argsBuilder({limit: 1.1}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    // =======================================================

    it('Must return INTERNAL_ERROR in case of error in DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.messagesGetListForChat = function(args, done) {
            done(new Error('Not implemented yet'));
        };

        var api = mock.api;
        api.hd_messagesList(argsBuilder(), function(err, result) {
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
        mock.dal.messagesGetListForChat = function(args, done) {
            done(null, null);
        };

        var api = mock.api;
        api.hd_messagesList(argsBuilder(), function(err, result) {
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

    // ==============================================================

    it('Must not allow not confirmed user to call this method', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.hd_messagesList(argsBuilder({accessToken: 'b6e84344-74e0-43f3-83e0-6a16c3fe6b5d'}), function(err) {
            if (err && err.number === dErrors.USER_NOT_CONFIRMED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Not confirmed user gained access to messages list');
                doneTest();
            }
        });
    });

    it('Check unknown chat for service user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({chatId: '10'});
        api.hd_messagesList(reqArgs, function(err, result) {
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
        api.hd_messagesList(reqArgs, function(err, result) {
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
        api.hd_messagesList(reqArgs, function(err, result) {
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
        api.hd_messagesList(reqArgs, function(err, result) {
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

    it('Service user must get access to all messages', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({chatId: '2'});
        api.hd_messagesList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }
            assert.typeOf(result, 'array', 'The conversations list response must be an array');
            assert.lengthOf(result, 4, 'The messages length must be equal to 4');
            doneTest();
        });
    });

    it('Application user must get access to all messages', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', chatId: '2'});
        api.hd_messagesList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }
            assert.typeOf(result, 'array', 'The conversations list response must be an array');
            assert.lengthOf(result, 4, 'The messages length must be equal to 4');
            doneTest();
        });
    });

    it('Chats must be in ASC order by created', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({chatId: '2'});
        api.hd_messagesList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }

            var prev = result[0].created.getTime();
            for (var i = 1; i < result.length; i++) {
                if (result[i].created.getTime() < prev) {
                    assert.fail('Messages are not in desc order');
                    break;
                }
            }

            doneTest();
        });
    });

    it('Big offset must return empty array', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({offset: 1000, limit: 50});
        api.hd_messagesList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }

            assert.lengthOf(result, 0, 'Offset that bigger the number of entries must return empty list of chats');
            doneTest();
        });
    });

    it('Negative offset must return data from end', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({offset: -2, limit: 50});
        api.hd_messagesList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }

            assert.lengthOf(result, 2, 'Negative offset 2 must return only last 2 messages');
            doneTest();
        });
    });

    it('Messages list must return valid objects', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({chatId: '2'});
        api.hd_messagesList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }

            var matchChat = {
                id: '6',
                userCreatorId: '2',
                userCreatorType: domain.userTypes.APP_USER,
                created: new Date('2012-05-01 13:26:00 +00:00'),
                content: 'Oh! Thanks',
                isRead: false
            };

            assert.deepEqual(result[3], matchChat, 'Expected message and received message are not match');
            doneTest();
        });
    });

    it('All messages must become read after calling this method', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({chatId: '2'});
        api.hd_messagesList(reqArgs, function(err) {
            if (err) {
                return doneTest(err);
            }
            api.hd_messagesList(reqArgs, function(err, result) {
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

});