/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var assert = require('chai').assert;
var tv4 = require('tv4');

var bllIntf = require('../../bll-interface');
var bllErrors = bllIntf.errors;


function failUnknownError(err) {
    assert.fail('Unknown error during checking the valid access token: ' + err);
}


describe('API methods', function() {
    var mockDal;
    var api;
    var appsListResponseSchema = require('../src/schemas/apps_list-res');

    before(function() {
        try {
            var mockDalDef = require('./_mockDal');
            mockDal = new mockDalDef(require('./_mockData').getCopy());
            var apiDef = require('../').api;
            api = new apiDef(mockDal);
        } catch(err) {
            assert.fail('Unable to instantiate mock data and DAL: ' + err);
        }
    });

    it('Check valid access token', function(doneTest) {
        api.apps_list(
            {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0'},
            function(err, result) {
                if (err) {
                    if (err.number && err.number === bllIntf.errors.INVALID_PARAMS) {
                        assert.fail('Valid access token did processed as invalid');
                    } else {
                        failUnknownError(err);
                    }
                }
                doneTest();
            }
        );
    });

    it('Check invalid access token', function(doneTest) {
        api.apps_list(
            {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'},
            function(err, result) {
                if (err) {
                    if (err.number && err.number !== bllIntf.errors.INVALID_PARAMS) {
                        assert.fail('Unknown error during checking the valid access token: ' + err);
                    }
                } else {
                    failUnknownError(err);
                }
                doneTest();
            }
        );
    });

    it('Check expired access token', function(doneTest) {
        api.apps_list(
            {access_token: '390582c6-a59b-4ab2-a8e1-87fdbb291b97'},
            function(err, result) {
                if (err) {
                    if (err.number !== bllErrors.INVALID_OR_EXPIRED_TOKEN) {
                        failUnknownError(err);
                    }
                } else {
                    assert.fail('Expired access token was processed as valid');
                }
                doneTest();
            }
        );
    });

    it('Service user must have access to applications list method', function(doneTest) {
        api.apps_list(
            {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0'},
            function(err, result) {
                if (err && err.number && err.number === bllErrors.ACCESS_DENIED) {
                    assert.fail('Access denied to applications list method for valid user');
                    doneTest();
                } else {
                    doneTest(err);
                }
            }
        );
    });

    it('Application user must not have access to applications list method', function(doneTest) {
        api.apps_list(
            {access_token: '302a1baa-78b0-4a4d-ae1f-ebb5a147c71a'},
            function(err, result) {
                if (err && err.number && err.number === bllErrors.ACCESS_DENIED) {
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
        api.apps_list(
            {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0'},
            function(err, apps) {
                if (err) {
                    return doneTest(err);
                }

                var validateResponse = tv4.validateResult(apps, appsListResponseSchema);
                assert.notOk(validateResponse.error, 'Apps list response do not match the response schema');

                assert.equal(apps.length, 1, 'Invalid number of applications');

                var matchApp = {
                    id: '0fd44c33-951a-4f2c-8fb3-6faf41970cb1',
                    platform_type: bllIntf.platforms.ANDROID,
                    title: 'Test App',
                    created: new Date('2014-05-01 13:00:00 +04:00'),
                    is_approved: true,
                    is_blocked: false,
                    is_deleted: false,
                    extra: {
                        package: 'com.testapp'
                    },
                    number_of_chats: 3,
                    number_of_all_messages: 8,
                    number_of_unread_messages: 1
                };

                assert.deepEqual(apps[0], matchApp, 'Expected application information and application in response did not match');

                doneTest();
            }
        );
    });

});