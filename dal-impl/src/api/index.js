/**
 * Created by UAS on 23.04.14.
 */

"use strict";

var domain = require('../domain');


var api_authToken_getUserInfoByToken = require('./_api_authToken_getUserInfoByToken');
var api_authToken_create = require('./_api_authToken_create');
var api_serviceUserGetCredentialsByLogin = require('./_api_serviceUserGetCredentialsByLogin');
var api_serviceUserGetProfileById = require('./_api_serviceUserGetProfileById');
var api_serviceUserCreate = require('./_api_serviceUserCreate');
var api_serviceUserUpdatePasswordHash = require('./_api_serviceUserUpdatePasswordHash');
var api_serviceUserRegisterConfirmDataGet = require('./_api_serviceUserRegisterConfirmDataGet');
var api_serviceUserRegisterConfirmDataCreate = require('./_api_serviceUserRegisterConfirmDataCreate');
var api_serviceUserMarkAsConfirmed = require('./_api_serviceUserMarkAsConfirmed');
var api_serviceUserResetPasswordConfirmDataGet = require('./_api_serviceUserResetPasswordConfirmDataGet');
var api_serviceUserResetPasswordConfirmDataCreate = require('./_api_serviceUserResetPasswordConfirmDataCreate');
var api_apps_getListForServiceUser = require('./_api_apps_getListForServiceUser');
var api_apps_isExists = require('./_api_apps_isExists');
var api_apps_getOwnerIdForAppById = require('./_api_apps_getOwnerIdForAppById');
var api_apps_create = require('./_api_apps_create');
var api_apps_getNumberOfChats = require('./_api_apps_getNumberOfChats');
var api_apps_getNumberOfMessages = require('./_api_apps_getNumberOfMessages');
var api_apps_getNumberOfUnreadMessages = require('./_api_apps_getNumberOfUnreadMessages');
var api_appUsers_getCredentialsByLogin = require('./_api_appUsers_getCredentialsByLogin');
var api_appUsers_getProfileById = require('./_api_appUsers_getProfileById');
var api_appUsers_create= require('./_api_appUsers_create');
var api_appUsers_update = require('./_api_appUsers_update');
var api_chats_getListWithLastMessageOrderByLastMessageCreatedAsc = require('./_api_chats_getListWithLastMessageOrderByLastMessageCreatedAsc');
var api_chats_isExists = require('./_api_chats_isExists');
var api_chats_getAppId = require('./_api_chats_getAppId');
var api_chats_isUserTheCreator = require('./_api_chats_isUserTheCreator');
var api_chats_getNumberOfUnreadMessagesPerChatForUser = require('./_api_chats_getNumberOfUnreadMessagesPerChatForUser');
var api_chats_getLastMessagePerChat = require('./_api_chats_getLastMessagePerChat');
var api_chats_getParticipantsInfo = require('./_api_chats_getParticipantsInfo');
var api_chats_createWithMessage = require('./_api_chats_createWithMessage');
var api_messages_getListForChatOrderByCreatedAsc = require('./_api_messages_getListForChatOrderByCreatedAsc');
var api_messages_getIsReadPerMessageForUser = require('./_api_messages_getIsReadPerMessageForUser');
var api_messages_setIsReadInChatForUser = require('./_api_messages_setIsReadInChatForUser');
var api_messages_create = require('./_api_messages_create');


var DAL = function(env) {
    if (typeof env !== 'object') {
        throw new Error('Environment must be a object');
    }
    if (!env) {
        throw new Error('Environment is not defined');
    }
    if (typeof env.configPostgres !== 'object' || !env.configPostgres) {
        throw new Error('ConfigPostgres is not defined or is null or is not a object');
    }

    env.pgConnectStr = 'postgres://' +
        env.configPostgres.user + ':' +
        env.configPostgres.password + '@' +
        env.configPostgres.host + ':' +
        env.configPostgres.port + '/' +
        env.configPostgres.db;

    this.env = env;
};

DAL.prototype._before = function(fn, args, next) {
    try {
        fn(this.env, args, next);
    } catch (err) {
        if (err.number === undefined) {
            err.number = domain.errors.INTERNAL_ERROR;
        }
        next(err);
    }
};


DAL.prototype.authToken_getUserInfoByToken = function(args, next) {
    this._before(api_authToken_getUserInfoByToken, args, next);
};

DAL.prototype.authToken_create = function(args, next) {
    this._before(api_authToken_create, args, next);
};


DAL.prototype.serviceUserGetCredentialsByLogin = function(args, next) {
    this._before(api_serviceUserGetCredentialsByLogin, args, next);
};

DAL.prototype.serviceUserGetProfileById = function (args, next) {
    this._before(api_serviceUserGetProfileById, args, next);
};

DAL.prototype.serviceUserCreate = function(args, next) {
    this._before(api_serviceUserCreate, args, next);
};

DAL.prototype.serviceUserUpdatePasswordHash = function (args, next) {
    this._before(api_serviceUserUpdatePasswordHash, args, next);
};


DAL.prototype.serviceUserRegisterConfirmDataGet = function(args, next) {
    this._before(api_serviceUserRegisterConfirmDataGet, args, next);
};

DAL.prototype.serviceUserRegisterConfirmDataCreate = function(args, next) {
    this._before(api_serviceUserRegisterConfirmDataCreate, args, next);
};

DAL.prototype.serviceUserMarkAsConfirmed = function(args, next) {
    this._before(api_serviceUserMarkAsConfirmed, args, next);
};


DAL.prototype.serviceUserResetPasswordConfirmDataGet = function(args, next) {
    this._before(api_serviceUserResetPasswordConfirmDataGet, args, next);
};

DAL.prototype.serviceUserResetPasswordConfirmDataCreate = function(args, next) {
    this._before(api_serviceUserResetPasswordConfirmDataCreate, args, next);
};


DAL.prototype.apps_getListForServiceUser = function(args, next) {
    this._before(api_apps_getListForServiceUser, args, next);
};

DAL.prototype.apps_isExists = function(args, next) {
    this._before(api_apps_isExists, args, next);
};

DAL.prototype.apps_getOwnerIdForAppById = function(args, next) {
    this._before(api_apps_getOwnerIdForAppById, args, next);
};

DAL.prototype.apps_create = function(args, next) {
    this._before(api_apps_create, args, next);
};

DAL.prototype.apps_getNumberOfChats = function(args, next) {
    this._before(api_apps_getNumberOfChats, args, next);
};

DAL.prototype.apps_getNumberOfMessages = function(args, next) {
    this._before(api_apps_getNumberOfMessages, args, next);
};

DAL.prototype.apps_getNumberOfUnreadMessages = function(args, next) {
    this._before(api_apps_getNumberOfUnreadMessages, args, next);
};


DAL.prototype.appUsers_getCredentialsByLogin = function(args, next) {
    this._before(api_appUsers_getCredentialsByLogin, args, next);
};

DAL.prototype.appUsers_getProfileById = function(args, next) {
    this._before(api_appUsers_getProfileById, args, next);
};

DAL.prototype.appUsers_create = function(args, next) {
    this._before(api_appUsers_create, args, next);
};

DAL.prototype.appUsers_update = function(args, next) {
    this._before(api_appUsers_update, args, next);
};

DAL.prototype.chats_getListWithLastMessageOrderByLastMessageCreatedAsc = function(args, next) {
    this._before(api_chats_getListWithLastMessageOrderByLastMessageCreatedAsc, args, next);
};

DAL.prototype.chats_isExists = function(args, next) {
    this._before(api_chats_isExists, args, next);
};

DAL.prototype.chats_getAppId = function(args, next) {
    this._before(api_chats_getAppId, args, next);
};

DAL.prototype.chats_isUserTheCreator = function(args, next) {
    this._before(api_chats_isUserTheCreator, args, next);
};

DAL.prototype.chats_getNumberOfUnreadMessagesPerChatForUser = function(args, next) {
    this._before(api_chats_getNumberOfUnreadMessagesPerChatForUser, args, next);
};

DAL.prototype.chats_getLastMessagePerChat = function(args, next) {
    this._before(api_chats_getLastMessagePerChat, args, next);
};

DAL.prototype.chats_getParticipantsInfo = function (args, next) {
    this._before(api_chats_getParticipantsInfo, args, next);
};

DAL.prototype.chats_createWithMessage = function(args, next) {
    this._before(api_chats_createWithMessage, args, next);
};


DAL.prototype.messages_getListForChatOrderByCreatedAsc = function(args, next) {
    this._before(api_messages_getListForChatOrderByCreatedAsc, args, next);
};

DAL.prototype.messages_getIsReadPerMessageForUser = function (args, next) {
    this._before(api_messages_getIsReadPerMessageForUser, args, next);
};

DAL.prototype.messages_setIsReadInChatForUser = function (args, next) {
    this._before(api_messages_setIsReadInChatForUser, args, next);
};

DAL.prototype.messages_create = function(args, next) {
    this._before(api_messages_create, args, next);
};


module.exports = DAL;