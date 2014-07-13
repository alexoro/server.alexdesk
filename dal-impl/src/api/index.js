/**
 * Created by UAS on 23.04.14.
 */

"use strict";

var domain = require('../domain');


var api_authTokenGetUserInfoByToken = require('./_api_authTokenGetUserInfoByToken');
var api_authTokenCreate = require('./_api_authTokenCreate');
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
var api_chatsGetListWithLastMessageOrderByLastMessageCreatedAsc = require('./_api_chatsGetListWithLastMessageOrderByLastMessageCreatedAsc');
var api_chatIsExists = require('./_api_chatIsExists');
var api_chatGetAppId = require('./_api_chatGetAppId');
var api_chatIsUserTheCreator = require('./_api_chatIsUserTheCreator');
var api_chatsGetNumberOfUnreadMessagesPerChatForUser = require('./_api_chatsGetNumberOfUnreadMessagesPerChatForUser');
var api_chatsGetLastMessagePerChat = require('./_api_chatsGetLastMessagePerChat');
var api_chatGetParticipantsInfo = require('./_api_chatGetParticipantsInfo');
var api_chatCreateWithMessage = require('./_api_chatCreateWithMessage');
var api_messagesGetListForChatOrderByCreatedAsc = require('./_api_messagesGetListForChatOrderByCreatedAsc');
var api_messagesGetIsReadPerMessageForUser = require('./_api_messagesGetIsReadPerMessageForUser');
var api_messagesSetIsReadInChatForUser = require('./_api_messagesSetIsReadInChatForUser');
var api_messageCreate = require('./_api_messageCreate');


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


DAL.prototype.authTokenGetUserInfoByToken = function(args, next) {
    this._before(api_authTokenGetUserInfoByToken, args, next);
};

DAL.prototype.authTokenCreate = function(args, next) {
    this._before(api_authTokenCreate, args, next);
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

DAL.prototype.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc = function(args, next) {
    this._before(api_chatsGetListWithLastMessageOrderByLastMessageCreatedAsc, args, next);
};

DAL.prototype.chatIsExists = function(args, next) {
    this._before(api_chatIsExists, args, next);
};

DAL.prototype.chatGetAppId = function(args, next) {
    this._before(api_chatGetAppId, args, next);
};

DAL.prototype.chatIsUserTheCreator = function(args, next) {
    this._before(api_chatIsUserTheCreator, args, next);
};

DAL.prototype.chatsGetNumberOfUnreadMessagesPerChatForUser = function(args, next) {
    this._before(api_chatsGetNumberOfUnreadMessagesPerChatForUser, args, next);
};

DAL.prototype.chatsGetLastMessagePerChat = function(args, next) {
    this._before(api_chatsGetLastMessagePerChat, args, next);
};

DAL.prototype.chatGetParticipantsInfo = function (args, next) {
    this._before(api_chatGetParticipantsInfo, args, next);
};

DAL.prototype.chatCreateWithMessage = function(args, next) {
    this._before(api_chatCreateWithMessage, args, next);
};


DAL.prototype.messagesGetListForChatOrderByCreatedAsc = function(args, next) {
    this._before(api_messagesGetListForChatOrderByCreatedAsc, args, next);
};

DAL.prototype.messagesGetIsReadPerMessageForUser = function (args, next) {
    this._before(api_messagesGetIsReadPerMessageForUser, args, next);
};

DAL.prototype.messagesSetIsReadInChatForUser = function (args, next) {
    this._before(api_messagesSetIsReadInChatForUser, args, next);
};

DAL.prototype.messageCreate = function(args, next) {
    this._before(api_messageCreate, args, next);
};


module.exports = DAL;