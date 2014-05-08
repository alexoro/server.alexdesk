/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var assert = require('chai').assert;


describe('Interface', function() {

    var bll = require('../');
    var bllApiDef = bll.api;

    it('Check constructor', function() {
        assert.isFunction(bllApiDef, 'Constructor must be a function');
        assert.lengthOf(bllApiDef, 1, 'Constructor must accept 1 arguments');

        try {
            var bllApi = new bllApiDef({dal: null, uuid: null});
        } catch (err) {
            assert.fail('Constructor call failed with error: ' + err);
        }
    });

    it('Check all interface functions are exists', function() {
        var bllApi = new bllApiDef({dal: null, uuid: null});

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

        assert.isDefined(bllApi.security_createAuthTokenForServiceUser, 'security_createAuthTokenForServiceUser function is not exists');
        assert.isFunction(bllApi.security_createAuthTokenForServiceUser, 'security_createAuthTokenForServiceUser must be a function');
        assert.equal(bllApi.security_createAuthTokenForServiceUser.length, 2, 'security_createAuthTokenForServiceUser must receive 2 arguments only');

        assert.isDefined(bllApi.security_createAuthTokenForServiceUser, 'security_createAuthTokenForAppUser function is not exists');
        assert.isFunction(bllApi.security_createAuthTokenForServiceUser, 'security_createAuthTokenForAppUser must be a function');
        assert.equal(bllApi.security_createAuthTokenForServiceUser.length, 2, 'security_createAuthTokenForAppUser must receive 2 arguments only');

        assert.isDefined(bllApi.users_init, 'users_init function is not exists');
        assert.isFunction(bllApi.users_init, 'users_init must be a function');
        assert.equal(bllApi.users_init.length, 2, 'users_init must receive 2 arguments only');

        assert.isDefined(bllApi.users_register, 'users_register function is not exists');
        assert.isFunction(bllApi.users_register, 'users_register must be a function');
        assert.equal(bllApi.users_register.length, 2, 'users_register must receive 2 arguments only');
    });

});
