/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var domain = require('../domain');

var errBuilder = require('./_errorBuilder');

var api_apps_list = require('./_api_apps_list');
var api_security_createAuthTokenForServiceUser = require('./_api_security_createAuthTokenForServiceUser');
var api_security_createAuthTokenForAppUser = require('./_api_security_createAuthTokenForAppUser');
var api_hd_chatsList = require('./_api_hd_chatsList');
var api_hd_messagesList = require('./_api_hd_messagesList');
var api_hd_messageCreate = require('./_api_hd_messageCreate');
var api_hd_chatCreate = require('./_api_hd_chatCreate');
var api_appUsers_init = require('./_api_appUsers_init');
var api_apps_create = require('./_api_apps_create');
var api_serviceUser_registerRequest = require('./_api_serviceUser_registerRequest');
var api_serviceUser_registerConfirm = require('./_api_serviceUser_registerConfirm');
var api_serviceUser_resetPasswordRequest = require('./_api_serviceUser_resetPasswordRequest');
var api_serviceUser_resetPasswordConfirm = require('./_api_serviceUser_resetPasswordConfirm');
var api_serviceUsers_resetPasswordLookup = require('./_api_serviceUser_resetPasswordLookup');


var Api = function(env) {
    if (typeof env !== 'object') {
        throw new Error('Environment must be a object');
    }
    if (!env) {
        throw new Error('Environment is not defined');
    }
    if (typeof env.dal !== 'object' || !env.dal) {
        throw new Error('DAL module is not defined or is null or is not a object');
    }
    if (typeof env.uuid !== 'object' || !env.uuid) {
        throw new Error('UUID generator is not defined or is null or is not a object');
    }
    if (typeof env.passwordManager !== 'object' || !env.passwordManager) {
        throw new Error('Password manager is not defined or is null or is not a object');
    }
    if (typeof env.accessTokenConfig !== 'object' || !env.accessTokenConfig) {
        throw new Error('Access token config is not defined or is null or is not a object');
    }
    if (typeof env.currentTimeProvider !== 'object' || !env.currentTimeProvider) {
        throw new Error('Current time provider is not defined or is null or is not a object');
    }

    this.env = env;
};

Api.prototype._before = function(fn, args, next) {
    try {
        fn(this.env, args, next);
    } catch (err) {
        next(errBuilder(domain.errors.INTERNAL_ERROR, err));
    }
};

Api.prototype.apps_list = function(args, next) {
    this._before(api_apps_list, args, next);
};

Api.prototype.hd_chatCreate = function(args, next) {
    this._before(api_hd_chatCreate, args, next);
};

Api.prototype.hd_chatsList = function(args, next) {
    this._before(api_hd_chatsList, args, next);
};

Api.prototype.hd_messageCreate = function(args, next) {
    this._before(api_hd_messageCreate, args, next);
};

Api.prototype.hd_messagesList = function(args, next) {
    this._before(api_hd_messagesList, args, next);
};

Api.prototype.security_createAuthTokenForServiceUser = function(args, next) {
    this._before(api_security_createAuthTokenForServiceUser, args, next);
};

Api.prototype.security_createAuthTokenForAppUser = function(args, next) {
    this._before(api_security_createAuthTokenForAppUser, args, next);
};

Api.prototype.appUsers_init = function(args, next) {
    this._before(api_appUsers_init, args, next);
};

Api.prototype.apps_create = function(args, next) {
    this._before(api_apps_create, args, next);
};

Api.prototype.serviceUsers_registerRequest = function(args, next) {
    this._before(api_serviceUser_registerRequest, args, next);
};

Api.prototype.serviceUsers_registerConfirm = function(args, next) {
    this._before(api_serviceUser_registerConfirm, args, next);
};

Api.prototype.serviceUsers_resetPasswordRequest = function(args, next) {
    this._before(api_serviceUser_resetPasswordRequest, args, next);
};

Api.prototype.serviceUsers_resetPasswordConfirm = function(args, next) {
    this._before(api_serviceUser_resetPasswordConfirm, args, next);
};

Api.prototype.serviceUsers_resetPasswordLookup = function (args, next) {
    this._before(api_serviceUsers_resetPasswordLookup, args, next);
};

module.exports = Api;