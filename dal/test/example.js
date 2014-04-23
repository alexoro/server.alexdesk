/**
 * Created by UAS on 23.04.14.
 */

var assert = require('chai').assert;

describe('smth', function() {
    it('smth2', function(done) {
        assert.equal(1, 1, 'Ololo');
        done();
    });
    it('smth3', function() {
        assert.equal(1, 1, 'Ololo');
    });
});