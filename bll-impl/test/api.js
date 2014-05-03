/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var assert = require('chai').assert;

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

    it('apps_list', function(doneTest) {
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