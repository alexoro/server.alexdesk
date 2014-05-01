/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var assert = require('chai').assert;

describe('Interface', function() {
    var bllApi;
    var bllCountries;
    var bllLanguages;

    before(function() {
        var bll = require('../');

        try {
            var bllApiDef = bll.api;
            bllApi = new bllApiDef(null);
        } catch (err) {
            assert.fail('Unable to instantiate BLL API definition from module: ' + err);
        }

        try {
            bllCountries = bll.countries;
        } catch (err) {
            assert.fail('Unable to instantiate BLL countries definition from module: ' + err);
            return;
        }

        try {
            bllLanguages = bll.languages;
        } catch (err) {
            assert.fail('Unable to instantiate BLL languages definition from module: ' + err);
        }
    });

    it('Check all interface functions are exists', function() {
        assert.isDefined(bllApi.apps_list, 'apps_list function is not exists');
        assert.isFunction(bllApi.apps_list, 'apps_list must be a function');
        assert.equal(bllApi.apps_list.length, 2, 'apps_list must receive 2 arguments only');

        assert.isDefined(bllApi.hd_conversationsList, 'hd_conversationsList function is not exists');
        assert.isFunction(bllApi.hd_conversationsList, 'hd_conversationsList must be a function');
        assert.equal(bllApi.hd_conversationsList.length, 2, 'hd_conversationsList must receive 2 arguments only');

        assert.isDefined(bllApi.hd_messageCreate, 'hd_messageCreate function is not exists');
        assert.isFunction(bllApi.hd_messageCreate, 'hd_messageCreate must be a function');
        assert.equal(bllApi.hd_messageCreate.length, 2, 'hd_messageCreate must receive 2 arguments only');

        assert.isDefined(bllApi.hd_messagesList, 'hd_messagesList function is not exists');
        assert.isFunction(bllApi.hd_messagesList, 'hd_messagesList must be a function');
        assert.equal(bllApi.hd_messagesList.length, 2, 'hd_messagesList must receive 2 arguments only');

        assert.isDefined(bllApi.security_createAuthToken, 'security_createAuthToken function is not exists');
        assert.isFunction(bllApi.security_createAuthToken, 'security_createAuthToken must be a function');
        assert.equal(bllApi.security_createAuthToken.length, 2, 'security_createAuthToken must receive 2 arguments only');

        assert.isDefined(bllApi.system_getTime, 'system_getTime function is not exists');
        assert.isFunction(bllApi.system_getTime, 'system_getTime must be a function');
        assert.equal(bllApi.system_getTime.length, 2, 'system_getTime must receive 2 arguments only');

        assert.isDefined(bllApi.users_init, 'users_init function is not exists');
        assert.isFunction(bllApi.users_init, 'users_init must be a function');
        assert.equal(bllApi.users_init.length, 2, 'users_init must receive 2 arguments only');

        assert.isDefined(bllApi.users_register, 'users_register function is not exists');
        assert.isFunction(bllApi.users_register, 'users_register must be a function');
        assert.equal(bllApi.users_register.length, 2, 'users_register must receive 2 arguments only');
    });

    it('Check countries', function() {
        assert.notOk(bllCountries.getIdByCode('RU'), 'Country id did retrieved via invalid code');
        assert.ok(bllCountries.getIdByCode('ru'), 'Country id did not retrieved via valid code');
        assert.notOk(bllCountries.getCodeById(-1), 'Country code is retrieved via invalid id');
        assert.ok(bllCountries.getCodeById(1), 'Country code is not retrieved via valid id');
    });

    it('Check languages', function() {
        assert.notOk(bllLanguages.getIdByCode('RU'), 'Language id did retrieved via invalid code');
        assert.ok(bllLanguages.getIdByCode('ru'), 'Language id did not retrieved via valid code');
        assert.notOk(bllLanguages.getCodeById(-1), 'Language code is retrieved via invalid id');
        assert.ok(bllLanguages.getCodeById(1), 'Language code is not retrieved via valid id');
    });

});
