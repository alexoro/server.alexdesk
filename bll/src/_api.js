/**
 * Created by UAS on 23.04.2014.
 */

var __apps_list = require('./__apps_list');
var __hd_conversationsList = require('./__hd_conversationsList');
var __hd_messageCreate = require('./__hd_messageCreate');
var __hd_messagesList = require('./__hd_messagesList');
var __security_createAuthToken = require('./__security_createAuthToken');
var __system_getTime = require('./__system_getTime');
var __users_init = require('./__users_init');
var __users_register = require('./__users_register');

var Api = function(DAL) {
    this.dal = DAL;
};

Api.prototype.apps_list = function(args, next) {
    __apps_list(args, next);
};

Api.prototype.hd_conversationsList = function(args, next) {
    __hd_conversationsList(args, next);
};

Api.prototype.hd_messageCreate = function(args, next) {
    __hd_messageCreate(args, next);
};

Api.prototype.hd_messagesList = function(args, next) {
    __hd_messagesList(args, next);
};

Api.prototype.security_createAuthToken = function(args, next) {
    __security_createAuthToken(args, next);
};

Api.prototype.system_getTime = function(args, next) {
    __system_getTime(args, next);
};

Api.prototype.users_init = function(args, next) {
    __users_init(args, next);
};

Api.prototype.users_register = function(args, next) {
    __users_register(args, next);
};


module.exports = Api;