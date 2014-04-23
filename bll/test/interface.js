/**
 * Created by UAS on 23.04.2014.
 */

var assert = require('chai').assert;

describe('Interface', function() {
    it('Check all interface functions are exists', function() {
        var iReq = require('../');
        var i = new iReq(null);

        assert.isDefined(i.apps_list, 'apps_list function is not exists');
        assert.isFunction(i.apps_list, 'apps_list must be a function');
        assert.equal(i.apps_list.length, 2, 'apps_list must receive 2 arguments only');

        assert.isDefined(i.hd_conversationsList, 'hd_conversationsList function is not exists');
        assert.isFunction(i.hd_conversationsList, 'hd_conversationsList must be a function');
        assert.equal(i.hd_conversationsList.length, 2, 'hd_conversationsList must receive 2 arguments only');

        assert.isDefined(i.hd_messageCreate, 'hd_messageCreate function is not exists');
        assert.isFunction(i.hd_messageCreate, 'hd_messageCreate must be a function');
        assert.equal(i.hd_messageCreate.length, 2, 'hd_messageCreate must receive 2 arguments only');

        assert.isDefined(i.hd_messagesList, 'hd_messagesList function is not exists');
        assert.isFunction(i.hd_messagesList, 'hd_messagesList must be a function');
        assert.equal(i.hd_messagesList.length, 2, 'hd_messagesList must receive 2 arguments only');

        assert.isDefined(i.security_createAuthToken, 'security_createAuthToken function is not exists');
        assert.isFunction(i.security_createAuthToken, 'security_createAuthToken must be a function');
        assert.equal(i.security_createAuthToken.length, 2, 'security_createAuthToken must receive 2 arguments only');

        assert.isDefined(i.system_getTime, 'system_getTime function is not exists');
        assert.isFunction(i.system_getTime, 'system_getTime must be a function');
        assert.equal(i.system_getTime.length, 2, 'system_getTime must receive 2 arguments only');

        assert.isDefined(i.users_init, 'users_init function is not exists');
        assert.isFunction(i.users_init, 'users_init must be a function');
        assert.equal(i.users_init.length, 2, 'users_init must receive 2 arguments only');

        assert.isDefined(i.users_register, 'users_register function is not exists');
        assert.isFunction(i.users_register, 'users_register must be a function');
        assert.equal(i.users_register.length, 2, 'users_register must receive 2 arguments only');
    });
});
