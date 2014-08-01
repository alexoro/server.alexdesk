/**
 * Created by UAS on 01.08.2014.
 */

"use strict";


var assert = require('chai').assert;

var Cmd2bll = require('../../src/cmd-to-bll/index');

var BllMock_v10_allError = require('./mock_bll_v1.0/BllAllErrorMock');


describe('bll_v1.0_errorIsReturnedCorrectly', function() {

    it('bll_1.0#apps_list is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'apps_list',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#hd_chatCreate is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'hd_chatCreate',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#hd_chatsList is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'hd_chatsList',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#hd_messageCreate is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'hd_messageCreate',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#hd_messagesList is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'hd_messagesList',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#security_createAuthTokenForServiceUser is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'security_createAuthTokenForServiceUser',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#security_createAuthTokenForAppUser is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'security_createAuthTokenForAppUser',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#appUsers_init is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'appUsers_init',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#apps_create is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'apps_create',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_registerRequest is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_registerRequest',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_registerConfirm is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_registerConfirm',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_resetPasswordRequest is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_resetPasswordRequest',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_resetPasswordConfirm is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_resetPasswordConfirm',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

    it('bll_1.0#serviceUsers_resetPasswordLookup is returning error', function () {
        var cmd2bll = new Cmd2bll();
        cmd2bll.setBllForApiVersion('1.0', new BllMock_v10_allError());

        var query = JSON.stringify({
            version: '1.0',
            method: 'serviceUsers_resetPasswordLookup',
            args: {}
        });
        cmd2bll.executeBllMethodFromEncodedReturnEncoded(query, function (result) {
            assert.isString(result, 'Result is not a string');
            var expected = {
                version: '1.0',
                error: new Error('Mock BLL'),
                result: null
            };
            assert.deepEqual(JSON.parse(result), expected, 'Expected and received objects are not match');
        });
    });

});