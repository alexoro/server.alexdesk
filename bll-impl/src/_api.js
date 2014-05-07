/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var api_apps_list = require('./_api_apps_list');
var api_security_createAuthToken = require('./_api_security_createAuthToken');


var Api = function(dal, uuidGenerator) {
    this.env = {
        dal: dal,
        uuid: uuidGenerator
    };
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

Api.prototype.security_createAuthToken = function(args, next) {
    this._before(api_security_createAuthToken, args, next);
};

Api.prototype.users_init = function(args, next) {
    next(null, null);
};

Api.prototype.users_register = function(args, next) {
    next(null, null);
};


module.exports = Api;