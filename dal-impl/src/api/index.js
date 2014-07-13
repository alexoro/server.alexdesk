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
var api_serviceUserGetResetPasswordConfirmData = require('./_api_serviceUserGetResetPasswordConfirmData');
var api_serviceUserCreateResetPasswordConfirmData = require('./_api_serviceUserCreateResetPasswordConfirmData');
var api_appsGetListForServiceUser = require('./_api_appsGetListForServiceUser');
var api_appIsExists = require('./_api_appIsExists');
var api_appGetOwnerIdForAppById = require('./_api_appGetOwnerIdForAppById');
var api_appCreate = require('./_api_appCreate');
var api_appsGetNumberOfChats = require('./_api_appsGetNumberOfChats');
var api_appsGetNumberOfMessages = require('./_api_appsGetNumberOfMessages');
var api_appsGetNumberOfUnreadMessages = require('./_api_appsGetNumberOfUnreadMessages');
var api_appUserGetCredentialsByLogin = require('./_api_appUserGetCredentialsByLogin');
var api_appUsersGetProfileById = require('./_api_appUsersGetProfileById');
var api_appUsersCreate= require('./_api_appUsersCreate');
var api_appUserUpdate = require('./_api_appUserUpdate');
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


DAL.prototype.serviceUserGetResetPasswordConfirmData = function(args, next) {
    this._before(api_serviceUserGetResetPasswordConfirmData, args, next);
};

DAL.prototype.serviceUserCreateResetPasswordConfirmData = function(args, next) {
    this._before(api_serviceUserCreateResetPasswordConfirmData, args, next);
};


DAL.prototype.appsGetListForServiceUser = function(args, next) {
    this._before(api_appsGetListForServiceUser, args, next);
};

DAL.prototype.appIsExists = function(args, next) {
    this._before(api_appIsExists, args, next);
};

DAL.prototype.appGetOwnerIdForAppById = function(args, next) {
    this._before(api_appGetOwnerIdForAppById, args, next);
};

DAL.prototype.appCreate = function(args, next) {
    this._before(api_appCreate, args, next);
};

DAL.prototype.appsGetNumberOfChats = function(args, next) {
    this._before(api_appsGetNumberOfChats, args, next);
};

DAL.prototype.appsGetNumberOfMessages = function(args, next) {
    this._before(api_appsGetNumberOfMessages, args, next);
};

DAL.prototype.appsGetNumberOfUnreadMessages = function(args, next) {
    this._before(api_appsGetNumberOfUnreadMessages, args, next);
};


DAL.prototype.appUserGetCredentialsByLogin = function(args, next) {
    this._before(api_appUserGetCredentialsByLogin, args, next);
};

DAL.prototype.appUsersGetProfileById = function(args, next) {
    this._before(api_appUsersGetProfileById, args, next);
};

DAL.prototype.appUsersCreate = function(args, next) {
    this._before(api_appUsersCreate, args, next);
};

DAL.prototype.appUserUpdate = function(args, next) {
    this._before(api_appUserUpdate, args, next);
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