/**
 * Created by UAS on 01.05.2014.
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


describe('API#apps_list', function() {

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

    it('Check invalid access token', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        var args = {accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'};
        api.apps_list(args, function(err, result) {
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
        var args = {accessToken: '390582c6-a59b-4ab2-a8e1-87fdbb291b97'};
        api.apps_list(args, function(err, result) {
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

    it('Service user must have access to applications list method', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.apps_list(
            {accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0'},
            function(err, result) {
                if (err && err.number && err.number === dErrors.ACCESS_DENIED) {
                    assert.fail('Access denied to applications list method for valid user');
                    doneTest();
                } else {
                    doneTest(err);
                }
            }
        );
    });

    it('Application user must not have access to applications list method', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.apps_list(
            {accessToken: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a'},
            function(err, result) {
                if (err && err.number && err.number === dErrors.ACCESS_DENIED) {
                    doneTest();
                } else if (err) {
                    doneTest(err);
                } else {
                    assert.fail('Application user get access to applications list method');
                    doneTest();
                }
            }
        );
    });

    it('Check applications list response', function(doneTest) {
        var api = mockBuilder.newApiWithMock().api;
        api.apps_list(
            {accessToken: '142b2b49-75f2-456f-9533-435bd0ef94c0'},
            function(err, apps) {
                if (err) {
                    return doneTest(err);
                }

                assert.equal(apps.length, 1, 'Invalid number of applications');

                var matchApp = {
                    id: '1',
                    platformType: domain.platforms.ANDROID,
                    title: 'Test App',
                    created: new Date('2014-05-01 13:00:00 +04:00'),
                    isApproved: true,
                    isBlocked: false,
                    isDeleted: false,
                    extra: {
                        package: 'com.testapp'
                    },
                    numberOfChats: 3,
                    numberOfAllMessages: 8,
                    numberOfUnreadMessages: 1
                };

                assert.deepEqual(apps[0], matchApp, 'Expected application information and application in response is not match');

                doneTest();
            }
        );
    });
});
