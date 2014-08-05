/**
 * Created by UAS on 01.08.2014.
 */

"use strict";


var assert = require('chai').assert;

var Cmd2bll = require('../../src/cmd-to-bll/index');

var BllMock_v10_passBy = require('./mock_bll_v1.0/BllPassByMock');


describe('bll_v1.0_methodsAreCalling', function() {

    it('bll_1.0#apps_list is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'apps_list',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#hd_chatCreate is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'hd_chatCreate',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#hd_chatsList is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'hd_chatsList',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#hd_messageCreate is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'hd_messageCreate',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#hd_messagesList is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'hd_messagesList',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#security_createAuthTokenForServiceUser is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'security_createAuthTokenForServiceUser',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#security_createAuthTokenForAppUser is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'security_createAuthTokenForAppUser',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#appUsers_init is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'appUsers_init',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#apps_create is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'apps_create',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_registerRequest is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_registerRequest',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_registerConfirm is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_registerConfirm',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_resetPasswordRequest is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_resetPasswordRequest',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_resetPasswordConfirm is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_resetPasswordConfirm',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_resetPasswordLookup is calling', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_passBy());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_resetPasswordLookup',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: null,
                result: {}
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

});