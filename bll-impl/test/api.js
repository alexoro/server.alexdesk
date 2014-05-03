/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var assert = require('chai').assert;
var async = require('async');

var bllIntf = require('../../bll-interface');


function failUnknownError(err) {
    assert.fail('Unknown error during checking the valid access token: ' + err);
}


describe('API methods', function() {
    var mockDal;
    var api;

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
                    if (err.number !== bllIntf.errors.INVALID_OR_EXPIRED_TOKEN) {
                        failUnknownError(err);
                    }
                } else {
                    assert.fail('Expired access token was processed as valid');
                }
                doneTest();
            }
        );
    });


//        bllIntf.errorBuilder(bllIntf.errors.USER_NOT_FOUND, 'No user is found for access token: ' + accessToken)
    it.skip('Check users are accessible via access token', function(doneTest) {
        async.series(
            [
                function(cb) {
                    api.apps_list(
                        {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0!!'},
                        function(err, result) {
                            if (err) {
                                assert.fail('Service user did not retrieved via valid token');
                            }
                            cb(err);
                        }
                    );
                },
                function(cb) {
                    api.apps_list(
                        {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0!'},
                        function(err, result) {
                            if (err) {
                                assert.fail('Service user did not retrieved via valid token');
                            }
                            cb(err);
                        }
                    );
                }
            ],
            function(err) {
                doneTest();
            }
        );


    });

    it('apps_list', function() {
//        api.apps_list(
//            {access_token: '142b2b49-75f2-456f-9533-435bd0ef94c0'},
//            function(err, result) {
//                if (err) {
//                    assert.fail('Apps_list error: ' + err);
//                }
//                doneTest(err);
//            }
//        );
//
//        var apps;
    });

});