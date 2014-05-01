/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var assert = require('chai').assert;

describe('Interface', function() {
    var bllApi;

    before(function() {
        var bll = require('../');

        try {
            var bllApiDef = bll.api;
            bllApi = new bllApiDef(null);
        } catch (err) {
            assert.fail('Unable to instantiate BLL API definition from module: ' + err);
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

});
