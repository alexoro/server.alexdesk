/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var domain = require('../domain');

var errBuilder = require('./_errorBuilder');
var api_apps_list = require('./_api_apps_list');
var api_security_createAuthTokenForServiceUser = require('./_api_security_createAuthTokenForServiceUser');
var api_security_createAuthTokenForAppUser = require('./_api_security_createAuthTokenForAppUser');


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
    next(null, null);
};

Api.prototype.hd_chatsList = function(args, next) {
    next(null, null);
};

Api.prototype.hd_messageCreate = function(args, next) {
    next(null, null);
};

Api.prototype.hd_messagesList = function(args, next) {
    next(null, null);
};

Api.prototype.security_createAuthTokenForServiceUser = function(args, next) {
    this._before(api_security_createAuthTokenForServiceUser, args, next);
};

Api.prototype.security_createAuthTokenForAppUser = function(args, next) {
    this._before(api_security_createAuthTokenForAppUser, args, next);
};

Api.prototype.serviceUsers_register = function(args, next) {
    next(null, null);
};

Api.prototype.appUsers_init = function(args, next) {
    next(null, null);
};


module.exports = Api;