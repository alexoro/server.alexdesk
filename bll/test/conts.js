/**
 * Created by UAS on 30.04.2014.
 */

var assert = require('chai').assert;

describe('Countries', function() {
    it('Check countries', function() {
        var c = require('../src/_countries');
        assert.notOk(c.getIdByCode('RU'), 'Country id did retrieved via invalid code');
        assert.ok(c.getIdByCode('ru'), 'Country id did not retrieved via valid code');
        assert.notOk(c.getCodeById(-1), 'Country code is retrieved via invalid id');
        assert.ok(c.getCodeById(1), 'Country code is not retrieved via valid id');
    });
});

describe('Languages', function() {
    it('Check languages', function() {
        var c = require('../src/_languages');
        assert.notOk(c.getIdByCode('RU'), 'Language id did retrieved via invalid code');
        assert.ok(c.getIdByCode('ru'), 'Language id did not retrieved via valid code');
        assert.notOk(c.getCodeById(-1), 'Language code is retrieved via invalid id');
        assert.ok(c.getCodeById(1), 'Language code is not retrieved via valid id');
    });
});