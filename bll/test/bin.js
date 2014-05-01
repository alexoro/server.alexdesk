/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

var assert = require('chai').assert;

describe.skip('Debug', function() {
    it('Debug purpose', function() {
        var req = require('../');
        var Methods = new req(null);
        console.log(Methods['apps.list']());
    });
});
