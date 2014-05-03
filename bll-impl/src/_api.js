/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var __apps_list = require('./_api_apps_list');
var __hd_conversationsList = require('./_api_hd_conversationsList');
var __hd_messageCreate = require('./_api_hd_messageCreate');
var __hd_messagesList = require('./_api_hd_messagesList');
var __security_createAuthToken = require('./_api_security_createAuthToken');
var __system_getTime = require('./_api_system_getTime');
var __users_init = require('./_api_users_init');
var __users_register = require('./_api_users_register');


var Api = function(DAL) {
    this.dal = DAL;
};

Api.prototype.apps_list = function(args, next) {
    _api_apps_list(this.dal, args, next);
};

Api.prototype.hd_conversationsList = function(args, next) {
    _api_hd_conversationsList(args, next);
};

Api.prototype.hd_messageCreate = function(args, next) {
    _api_hd_messageCreate(args, next);
};

Api.prototype.hd_messagesList = function(args, next) {
    _api_hd_messagesList(args, next);
};

Api.prototype.security_createAuthToken = function(args, next) {
    _api_security_createAuthToken(args, next);
};

Api.prototype.system_getTime = function(args, next) {
    _api_system_getTime(args, next);
};

Api.prototype.users_init = function(args, next) {
    _api_users_init(args, next);
};

Api.prototype.users_register = function(args, next) {
    _api_users_register(args, next);
};


module.exports = Api;