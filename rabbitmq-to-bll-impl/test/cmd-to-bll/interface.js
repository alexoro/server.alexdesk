/**
 * Created by UAS on 23.04.2014.
 */

"use strict";


var assert = require('chai').assert;

var Bll2Cmd = require('../../src/cmd-to-bll');


describe('API::Interface', function() {

    it('Check constructor', function() {
        assert.isFunction(Bll2Cmd, 'Constructor must be a function');
        assert.lengthOf(Bll2Cmd, 0, 'Constructor must accept no arguments');

        try {
            var bll2cmd = new Bll2Cmd();
        } catch (err) {
            assert.fail('Constructor call failed with error: ' + err);
        }
    });

    it('Check all interface functions are exists', function() {
        var bll2cmd = new Bll2Cmd();

        assert.isDefined(bll2cmd.setBllForApiVersion, 'setBllForApiVersion function is not exists');
        assert.isFunction(bll2cmd.setBllForApiVersion, 'setBllForApiVersion must be a function');
        assert.equal(bll2cmd.setBllForApiVersion.length, 2, 'setBllForApiVersion must receive 2 arguments only');

        assert.isDefined(bll2cmd.getBllForApiVersion, 'getBllForApiVersion function is not exists');
        assert.isFunction(bll2cmd.getBllForApiVersion, 'getBllForApiVersion must be a function');
        assert.equal(bll2cmd.getBllForApiVersion.length, 1, 'getBllForApiVersion must receive 1 argument only');

        assert.isDefined(bll2cmd.executeBllMethodFromEncodedReturnEncoded, 'executeBllMethodFromEncodedReturnEncoded function is not exists');
        assert.isFunction(bll2cmd.executeBllMethodFromEncodedReturnEncoded, 'executeBllMethodFromEncodedReturnEncoded must be a function');
        assert.equal(bll2cmd.executeBllMethodFromEncodedReturnEncoded.length, 2, 'executeBllMethodFromEncodedReturnEncoded must receive 2 arguments only');
    });

});
