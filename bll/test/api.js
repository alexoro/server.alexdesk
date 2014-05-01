/**
 * Created by UAS on 01.05.2014.
 */

"use strict";

var assert = require('chai').assert;

describe('API methods', function() {
    var mockDal;

    before(function() {
        try {
            var mockDalDef = require('./_mockDal');
            mockDal = new mockDalDef(require('./_mockData').getCopy());
        } catch(err) {
            assert.fail('Unable to instantiate mock data and DAL: ' + err);
        }
    });

    it('apps_list', function() {
//        var req = require('../');
//        var Methods = new req(null);
//        console.log(Methods['apps.list']());
    });

});