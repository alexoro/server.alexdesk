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
        appId: override.appId === undefined ? '1' : override.appId,
        offset: override.offset === undefined ? 0 : override.offset,
        limit: override.limit === undefined ? 50 : override.limit
    };
};


describe('API#hd_chatsList', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatsList(null, invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList({}, invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(-1, invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: app id is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
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

    it('Validate invalid arguments: offset is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatsList(argsBuilder({offset: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({offset: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({offset: ''}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({offset: 'xxx@xx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({offset:  -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({offset: 0.2}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Validate invalid arguments: limit is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatsList(argsBuilder({limit: null}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({limit: {}}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({limit: 'xxx@xx:com'}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({limit: -1}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({limit: 200}), invalidArgsCb(cb));
            },
            function(cb) {
                api.hd_chatsList(argsBuilder({limit: 1.2}), invalidArgsCb(cb));
            }
        ];
        async.series(fnStack, doneTest);
    });

    it('Check invalid access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder({accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'});
        api.hd_chatsList(args, function(err, result) {
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
        api.hd_chatsList(args, function(err, result) {
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

    it('Must return INTERNAL_ERROR in case of error in DAL', function(doneTest) {
        var mock = mockBuilder.newApiWithMock();
        mock.dal.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc = function(args, done) {
            done(new Error('Not implemented yet'));
        };

        var api = mock.api;
        api.hd_chatsList(argsBuilder(), function(err, result) {
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
        mock.dal.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc = function(args, done) {
            done(null, null);
        };

        var api = mock.api;
        api.hd_chatsList(argsBuilder(), function(err, result) {
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

    // =================================================

    it('Must not allow not confirmed user to call this method', function (doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.hd_chatsList(argsBuilder({accessToken: 'b6e84344-74e0-43f3-83e0-6a16c3fe6b5d'}), function(err) {
            if (err && err.number === dErrors.USER_NOT_CONFIRMED) {
                doneTest();
            } else if (err) {
                doneTest(err);
            } else {
                assert.fail('Not confirmed user gained access to the chats list');
                doneTest();
            }
        });
    });

    it('Check unknown application for service user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({appId: '10'});
        api.hd_chatsList(reqArgs, function(err, result) {
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
        api.hd_chatsList(reqArgs, function(err, result) {
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
        var reqArgs = argsBuilder({appId: '2'});
        api.hd_chatsList(reqArgs, function(err, result) {
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
        api.hd_chatsList(reqArgs, function(err, result) {
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

    it('Service user must get access to all chats', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.hd_chatsList(argsBuilder(), function(err, result) {
            if (err) {
                return doneTest(err);
            }
            assert.typeOf(result, 'array', 'The conversations list response must be an array');
            assert.lengthOf(result, 3, 'The conversations length must be equal to 3');
            doneTest();
        });
    });

    it('Application user must get access only to his chats', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', appId: '1'});
        api.hd_chatsList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }
            assert.typeOf(result, 'array', 'The conversations list response must be an array');
            assert.lengthOf(result, 2, 'The conversations length must be equal to 2');
            doneTest();
        });
    });

    it('Chats must be in ASC order by last message created time', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.hd_chatsList(argsBuilder(), function(err, result) {
            if (err) {
                return doneTest(err);
            }

            var prev = result[0].lastMessage.created.getTime();
            for (var i = 1; i < result.length; i++) {
                if (result[i].lastMessage.created.getTime() < prev) {
                    assert.fail('Conversations are not in ASC order');
                    break;
                }
            }

            doneTest();
        });
    });

    it('Big offset must return empty array', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder({offset: 1000, limit: 50});
        api.hd_chatsList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }

            assert.lengthOf(result, 0, 'Offset that bigger the number of entries must return empty list of chats');
            doneTest();
        });
    });

    it('Chats list must return valid objects', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.hd_chatsList(argsBuilder(), function(err, result) {
            if (err) {
                return doneTest(err);
            }

            var matchChat = {
                id: '2',
                appId: '1',
                userCreatorId: '2',
                userCreatorType: domain.userTypes.APP_USER,
                created: new Date('2012-05-01 13:20:00 +00:00'),
                title: '',
                type: domain.chatTypes.UNKNOWN,
                status: domain.chatStatuses.UNKNOWN,
                numberOfUnreadMessages: 1,
                extra: {
                    countryId: domain.countries.getIdByCode('ru'),
                    langId: domain.languages.getIdByCode('ru'),
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
                    id: '6',
                    chatId: '2',
                    userCreatorId: '2',
                    userCreatorType: domain.userTypes.APP_USER,
                    created: new Date('2012-05-01 13:26:00 +00:00'),
                    content: 'Oh! Thanks'
                }
            };

            assert.deepEqual(result[1], matchChat, 'Expected chat and received chat are not match');
            doneTest();
        });
    });

});