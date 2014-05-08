/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var api_apps_list = require('./_api_apps_list');
var api_security_createAuthTokenForServiceUser = require('./_api_security_createAuthTokenForServiceUser');


var Api = function(env) {
    if (typeof env !== 'object') {
        throw new Error('Environment must be a object');
    }
    if (!env) {
        throw new Error('Environment is not defined');
    }
    if (env.dal === undefined) {
        throw new Error('DAL module is not defined');
    }
    if (env.uuid === undefined) {
        throw new Error('UUID generator is not defined');
    }

    this.env = env;
};

Api.prototype._before = function(fn, args, next) {
    try {
        fn(this.env, args, next);
    } catch (err) {
        next(err);
    }
};

Api.prototype.apps_list = function(args, next) {
    this._before(api_apps_list, args, next);
};

Api.prototype.hd_conversationsList = function(args, next) {
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
    next(null, null);
};

Api.prototype.users_init = function(args, next) {
    next(null, null);
};

Api.prototype.users_register = function(args, next) {
    next(null, null);
};


module.exports = Api;