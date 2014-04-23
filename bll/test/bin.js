/**
 * Created by UAS on 24.04.2014.
 */

var assert = require('chai').assert;

describe('Method calls', function() {
    it('apps_list', function(done) {
        var iReq = require('../');
        var i = new iReq(null);
        i.apps_list(null, function(err, success) {
            assert.isArray(success);
            done();
        });
    });

    it('hd_conversationsList', function(done) {
        var iReq = require('../');
        var i = new iReq(null);
        i.hd_conversationsList(null, function(err, success) {
            assert.isArray(success);
            done();
        });
    });
    it('hd_messageCreate', function(done) {
        var iReq = require('../');
        var i = new iReq(null);
        i.hd_messageCreate(null, function(err, success) {
            assert.isObject(success);
            done();
        });
    });
    it('hd_messagesList', function(done) {
        var iReq = require('../');
        var i = new iReq(null);
        i.hd_messagesList(null, function(err, success) {
            assert.isArray(success);
            done();
        });
    });

    it('security_createAuthToken', function(done) {
        var iReq = require('../');
        var i = new iReq(null);
        i.security_createAuthToken(null, function(err, success) {
            assert.isObject(success);
            done();
        });
    });

    it('system_getTime', function(done) {
        var iReq = require('../');
        var i = new iReq(null);
        i.system_getTime(null, function(err, success) {
            assert.isObject(success);
            done();
        });
    });

    it('users_init', function(done) {
        var iReq = require('../');
        var i = new iReq(null);
        i.users_init(null, function(err, success) {
            assert.isNull(success);
            done();
        });
    });
    it('users_register', function(done) {
        var iReq = require('../');
        var i = new iReq(null);
        i.users_register(null, function(err, success) {
            assert.isObject(success);
            done();
        });
    });
});
