/**
 * Created by UAS on 23.04.2014.
 */

"use strict";


var assert = require('chai').assert;
var domain = require('../../').domain;


describe('Domain::Interface', function() {
    var iCountries;
    var iLanguages;

    before(function() {

        try {
            iCountries = domain.countries;
        } catch (err) {
            assert.fail('Unable to instantiate countries definition from module: ' + err);
            return;
        }

        try {
            iLanguages = domain.languages;
        } catch (err) {
            assert.fail('Unable to instantiate languages definition from module: ' + err);
        }
    });

    it('Check countries', function() {
        assert.notOk(iCountries.getIdByCode('RU'), 'Country id did retrieved via invalid code');
        assert.ok(iCountries.getIdByCode('ru'), 'Country id did not retrieved via valid code');
        assert.notOk(iCountries.getCodeById(-1), 'Country code is retrieved via invalid id');
        assert.ok(iCountries.getCodeById(1), 'Country code is not retrieved via valid id');
    });

    it('Check languages', function() {
        assert.notOk(iLanguages.getIdByCode('RU'), 'Language id did retrieved via invalid code');
        assert.ok(iLanguages.getIdByCode('ru'), 'Language id did not retrieved via valid code');
        assert.notOk(iLanguages.getCodeById(-1), 'Language code is retrieved via invalid id');
        assert.ok(iLanguages.getCodeById(1), 'Language code is not retrieved via valid id');
    });

});
