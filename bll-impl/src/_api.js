/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var api_apps_list = require('./_api_apps_list');
var api_security_createAuthToken = require('./_api_security_createAuthToken');


var Api = function(DAL) {
    this.dal = DAL;
};

Api.prototype.apps_list = function(args, next) {
    api_apps_list(this.dal, args, next);
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
    api_security_createAuthToken(this.dal, args, next);
};

Api.prototype.users_init = function(args, next) {
    next(null, null);
};

Api.prototype.users_register = function(args, next) {
    next(null, null);
};


module.exports = Api;