/**
 * Created by UAS on 11.05.2014.
 */

"use strict";

var assert = require('chai').assert;
var async = require('async');

var domain = require('../../').domain;
var dErrors = domain.errors;

var mockBuilder = require('./mock/');


var argsBuilder = function(accessToken, appId, offset, limit) {
    return {
        accessToken: accessToken, appId: appId, offset: offset === undefined ? 0 : offset, limit: limit === undefined ? 50 : limit
    };
};

var fnStackInvalidArgsCallback = function(doneTest) {
    return function(err) {
        if (err && err.number && err.number === dErrors.INVALID_PARAMS) {
            doneTest();
        } else if (err) {
            doneTest(err);
        } else {
            assert.fail('Application passed some invalid argument');
            doneTest();
        }
    };
};

describe('API#hd_chatsList', function() {

    it('Validate invalid arguments: all is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var fnStack = [
            function(cb) {
                api.hd_chatsList(null, cb);
            },
            function(cb) {
                api.hd_chatsList({}, cb);
            },
            function(cb) {
                api.hd_chatsList(-1, cb);
            }
        ];
        async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
    });

    it('Validate invalid arguments: app id is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
        var fnStack = [
            function(cb) {
                api.hd_chatsList(argsBuilder(token, null), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, {}), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token,''), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, 'xxx@xx:com'), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, '-1'), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, '1.1'), cb);
            },
            function(cb) {
                var appId = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
                api.hd_chatsList(argsBuilder(token, appId), cb);
            }
        ];
        async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
    });

    it('Validate invalid arguments: offset is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
        var appId = '1';
        var fnStack = [
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, null), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, {}), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, ''), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, 'xxx@xx:com'), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, -1), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, 0.2), cb);
            }
        ];
        async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
    });

    it('Validate invalid arguments: limit is invalid', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var token = '142b2b49-75f2-456f-9533-435bd0ef94c0';
        var appId = '1';
        var offset = 0;
        var fnStack = [
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, offset, null), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, offset, {}), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, offset, 'xxx@xx:com'), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, offset, -1), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, offset, 100), cb);
            },
            function(cb) {
                api.hd_chatsList(argsBuilder(token, appId, offset, 1.2), cb);
            }
        ];
        async.series(fnStack, fnStackInvalidArgsCallback(doneTest));
    });

    it('Check invalid access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0!!', '1');
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
        var args = argsBuilder('390582c6-a59b-4ab2-a8e1-87fdbb291b97', '1');
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
        mock.dal.getChatsList = function(args, done) {
            done(new Error('Not implemented yet'));
        };

        var api = mock.api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '1');
        api.hd_chatsList(reqArgs, function(err, result) {
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
        mock.dal.getChatsList = function(args, done) {
            done(null, null);
        };

        var api = mock.api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '1');
        api.hd_chatsList(reqArgs, function(err, result) {
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

    it('Check unknown application for service user', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '10');
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
        var reqArgs = argsBuilder('302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', '10');
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
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '2');
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
        var reqArgs = argsBuilder('302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', '2');
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
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '1');
        api.hd_chatsList(reqArgs, function(err, result) {
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
        var reqArgs = argsBuilder('302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', '1');
        api.hd_chatsList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }
            assert.typeOf(result, 'array', 'The conversations list response must be an array');
            assert.lengthOf(result, 2, 'The conversations length must be equal to 2');
            doneTest();
        });
    });

    it('Chats must be in DESC order by last_update', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '1');
        api.hd_chatsList(reqArgs, function(err, result) {
            if (err) {
                return doneTest(err);
            }

            var prev = result[0].lastUpdate.getTime();
            for (var i = 1; i < result.length; i++) {
                if (result[i].lastUpdate.getTime() < prev) {
                    assert.fail('Conversations are not in desc order');
                    break;
                }
            }

            doneTest();
        });
    });

    it('Big offset must return empty array', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '1', 1000, 50);
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
        var reqArgs = argsBuilder('142b2b49-75f2-456f-9533-435bd0ef94c0', '1');
        api.hd_chatsList(reqArgs, function(err, result) {
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
                lastUpdate: new Date('2012-05-01 13:26:00 +00:00'),
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