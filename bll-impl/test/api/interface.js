/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var assert = require('chai').assert;
var Api = require('../../').api;
var mock = require('./mock/');


describe('API::Interface', function() {

    it('Check constructor', function() {
        assert.isFunction(Api, 'Constructor must be a function');
        assert.lengthOf(Api, 1, 'Constructor must accept 1 arguments');

        try {
            var api = mock.newApiWithMock().api;
        } catch (err) {
            assert.fail('Constructor call failed with error: ' + err);
        }
    });

    it('Check all interface functions are exists', function() {
        var api = mock.newApiWithMock().api;

        assert.isDefined(api.apps_list, 'apps_list function is not exists');
        assert.isFunction(api.apps_list, 'apps_list must be a function');
        assert.equal(api.apps_list.length, 2, 'apps_list must receive 2 arguments only');

        assert.isDefined(api.hd_chatsList, 'hd_chatsList function is not exists');
        assert.isFunction(api.hd_chatsList, 'hd_chatsList must be a function');
        assert.equal(api.hd_chatsList.length, 2, 'hd_chatsList must receive 2 arguments only');

        assert.isDefined(api.hd_chatCreate, 'hd_chatCreate function is not exists');
        assert.isFunction(api.hd_chatCreate, 'hd_chatCreate must be a function');
        assert.equal(api.hd_chatCreate.length, 2, 'hd_chatCreate must receive 2 arguments only');

        assert.isDefined(api.hd_messageCreate, 'hd_messageCreate function is not exists');
        assert.isFunction(api.hd_messageCreate, 'hd_messageCreate must be a function');
        assert.equal(api.hd_messageCreate.length, 2, 'hd_messageCreate must receive 2 arguments only');

        assert.isDefined(api.hd_messagesList, 'hd_messagesList function is not exists');
        assert.isFunction(api.hd_messagesList, 'hd_messagesList must be a function');
        assert.equal(api.hd_messagesList.length, 2, 'hd_messagesList must receive 2 arguments only');

        assert.isDefined(api.security_createAuthTokenForServiceUser, 'security_createAuthTokenForServiceUser function is not exists');
        assert.isFunction(api.security_createAuthTokenForServiceUser, 'security_createAuthTokenForServiceUser must be a function');
        assert.equal(api.security_createAuthTokenForServiceUser.length, 2, 'security_createAuthTokenForServiceUser must receive 2 arguments only');

        assert.isDefined(api.security_createAuthTokenForServiceUser, 'security_createAuthTokenForAppUser function is not exists');
        assert.isFunction(api.security_createAuthTokenForServiceUser, 'security_createAuthTokenForAppUser must be a function');
        assert.equal(api.security_createAuthTokenForServiceUser.length, 2, 'security_createAuthTokenForAppUser must receive 2 arguments only');

        assert.isDefined(api.serviceUsers_register, 'serviceUsers_register function is not exists');
        assert.isFunction(api.serviceUsers_register, 'serviceUsers_register must be a function');
        assert.equal(api.serviceUsers_register.length, 2, 'serviceUsers_register must receive 2 arguments only');

        assert.isDefined(api.appUsers_init, 'appUsers_init function is not exists');
        assert.isFunction(api.appUsers_init, 'appUsers_init must be a function');
        assert.equal(api.appUsers_init.length, 2, 'appUsers_init must receive 2 arguments only');
    });

});
