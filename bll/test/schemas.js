/**
 * Created by UAS on 01.05.2014.
 */

var assert = require('chai').assert;

describe('Schemas', function() {
    it('Schemas are opening', function() {
        try {
            require('../src/schemas/apps_list-req');
            require('../src/schemas/apps_list-res');
        } catch(err) {
            assert.fail('Some schema file cannot be open: ' + err);
        }
    });
});