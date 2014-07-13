/**
 * Created by UAS on 09.06.2014.
 */

"use strict";


var assert = require('chai').assert;

var Api = require('../../src/index').api;
var domain = require('../../src/index').domain;

var mock = require('./../mock/index');


describe('API::Interface', function() {

    it('Check constructor', function() {
        assert.isFunction(Api, 'Constructor must be a function');
        assert.lengthOf(Api, 1, 'Constructor must accept 1 arguments');

        try {
            var api = mock.newApiWithMock().api;
        } catch (err) {
            assert.fail('Constructor call failed with error: ' + err);
        }
    });

    it('Check all interface functions are exists', function() {
        var api = mock.newApiWithMock().api;

        assert.isDefined(api.authToken_getUserInfoByToken, 'authToken_getUserInfoByToken function is not exists');
        assert.isFunction(api.authToken_getUserInfoByToken, 'authToken_getUserInfoByToken must be a function');
        assert.equal(api.authToken_getUserInfoByToken.length, 2, 'authToken_getUserInfoByToken must receive 2 arguments only');

        assert.isDefined(api.authToken_create, 'authToken_create function is not exists');
        assert.isFunction(api.authToken_create, 'authToken_create must be a function');
        assert.equal(api.authToken_create.length, 2, 'authToken_create must receive 2 arguments only');


        assert.isDefined(api.serviceUserGetCredentialsByLogin, 'serviceUserGetCredentialsByLogin function is not exists');
        assert.isFunction(api.serviceUserGetCredentialsByLogin, 'serviceUserGetCredentialsByLogin must be a function');
        assert.equal(api.serviceUserGetCredentialsByLogin.length, 2, 'serviceUserGetCredentialsByLogin must receive 2 arguments only');

        assert.isDefined(api.serviceUserGetProfileById, 'serviceUserGetProfileById function is not exists');
        assert.isFunction(api.serviceUserGetProfileById, 'serviceUserGetProfileById must be a function');
        assert.equal(api.serviceUserGetProfileById.length, 2, 'serviceUserGetProfileById must receive 2 arguments only');

        assert.isDefined(api.serviceUserCreate, 'serviceUserCreate function is not exists');
        assert.isFunction(api.serviceUserCreate, 'serviceUserCreate must be a function');
        assert.equal(api.serviceUserCreate.length, 2, 'serviceUserCreate must receive 2 arguments only');

        assert.isDefined(api.serviceUserUpdatePasswordHash, 'serviceUserUpdatePasswordHash function is not exists');
        assert.isFunction(api.serviceUserUpdatePasswordHash, 'serviceUserUpdatePasswordHash must be a function');
        assert.equal(api.serviceUserUpdatePasswordHash.length, 2, 'serviceUserUpdatePasswordHash must receive 2 arguments only');


        assert.isDefined(api.serviceUserRegisterConfirmDataGet, 'serviceUserRegisterConfirmDataGet function is not exists');
        assert.isFunction(api.serviceUserRegisterConfirmDataGet, 'serviceUserRegisterConfirmDataGet must be a function');
        assert.equal(api.serviceUserRegisterConfirmDataGet.length, 2, 'serviceUserRegisterConfirmDataGet must receive 2 arguments only');

        assert.isDefined(api.serviceUserRegisterConfirmDataCreate, 'serviceUserRegisterConfirmDataCreate function is not exists');
        assert.isFunction(api.serviceUserRegisterConfirmDataCreate, 'serviceUserRegisterConfirmDataCreate must be a function');
        assert.equal(api.serviceUserRegisterConfirmDataCreate.length, 2, 'serviceUserRegisterConfirmDataCreate must receive 2 arguments only');

        assert.isDefined(api.serviceUserMarkAsConfirmed, 'serviceUserMarkAsConfirmed function is not exists');
        assert.isFunction(api.serviceUserMarkAsConfirmed, 'serviceUserMarkAsConfirmed must be a function');
        assert.equal(api.serviceUserMarkAsConfirmed.length, 2, 'serviceUserMarkAsConfirmed must receive 2 arguments only');


        assert.isDefined(api.serviceUserResetPasswordConfirmDataGet, 'serviceUserResetPasswordConfirmDataGet function is not exists');
        assert.isFunction(api.serviceUserResetPasswordConfirmDataGet, 'serviceUserResetPasswordConfirmDataGet must be a function');
        assert.equal(api.serviceUserResetPasswordConfirmDataGet.length, 2, 'serviceUserResetPasswordConfirmDataGet must receive 2 arguments only');

        assert.isDefined(api.serviceUserResetPasswordConfirmDataCreate, 'serviceUserResetPasswordConfirmDataCreate function is not exists');
        assert.isFunction(api.serviceUserResetPasswordConfirmDataCreate, 'serviceUserResetPasswordConfirmDataCreate must be a function');
        assert.equal(api.serviceUserResetPasswordConfirmDataCreate.length, 2, 'serviceUserResetPasswordConfirmDataCreate must receive 2 arguments only');


        assert.isDefined(api.apps_getListForServiceUser, 'apps_getListForServiceUser function is not exists');
        assert.isFunction(api.apps_getListForServiceUser, 'apps_getListForServiceUser must be a function');
        assert.equal(api.apps_getListForServiceUser.length, 2, 'apps_getListForServiceUser must receive 2 arguments only');

        assert.isDefined(api.apps_isExists, 'apps_isExists function is not exists');
        assert.isFunction(api.apps_isExists, 'apps_isExists must be a function');
        assert.equal(api.apps_isExists.length, 2, 'apps_isExists must receive 2 arguments only');

        assert.isDefined(api.apps_getOwnerIdForAppById, 'apps_getOwnerIdForAppById function is not exists');
        assert.isFunction(api.apps_getOwnerIdForAppById, 'apps_getOwnerIdForAppById must be a function');
        assert.equal(api.apps_getOwnerIdForAppById.length, 2, 'apps_getOwnerIdForAppById must receive 2 arguments only');

        assert.isDefined(api.apps_create, 'apps_create function is not exists');
        assert.isFunction(api.apps_create, 'apps_create must be a function');
        assert.equal(api.apps_create.length, 2, 'apps_create must receive 2 arguments only');

        assert.isDefined(api.apps_getNumberOfChats, 'apps_getNumberOfChats function is not exists');
        assert.isFunction(api.apps_getNumberOfChats, 'apps_getNumberOfChats must be a function');
        assert.equal(api.apps_getNumberOfChats.length, 2, 'apps_getNumberOfChats must receive 2 arguments only');

        assert.isDefined(api.apps_getNumberOfMessages, 'apps_getNumberOfMessages function is not exists');
        assert.isFunction(api.apps_getNumberOfMessages, 'apps_getNumberOfMessages must be a function');
        assert.equal(api.apps_getNumberOfMessages.length, 2, 'apps_getNumberOfMessages must receive 2 arguments only');

        assert.isDefined(api.apps_getNumberOfUnreadMessages, 'apps_getNumberOfUnreadMessages function is not exists');
        assert.isFunction(api.apps_getNumberOfUnreadMessages, 'apps_getNumberOfUnreadMessages must be a function');
        assert.equal(api.apps_getNumberOfUnreadMessages.length, 2, 'apps_getNumberOfUnreadMessages must receive 2 arguments only');


        assert.isDefined(api.appUsers_getCredentialsByLogin, 'appUsers_getCredentialsByLogin function is not exists');
        assert.isFunction(api.appUsers_getCredentialsByLogin, 'appUsers_getCredentialsByLogin must be a function');
        assert.equal(api.appUsers_getCredentialsByLogin.length, 2, 'appUsers_getCredentialsByLogin must receive 2 arguments only');

        assert.isDefined(api.appUsers_getProfileById, 'appUsers_getProfileById function is not exists');
        assert.isFunction(api.appUsers_getProfileById, 'appUsers_getProfileById must be a function');
        assert.equal(api.appUsers_getProfileById.length, 2, 'appUsers_getProfileById must receive 2 arguments only');

        assert.isDefined(api.appUsers_create, 'appUsers_create function is not exists');
        assert.isFunction(api.appUsers_create, 'appUsers_create must be a function');
        assert.equal(api.appUsers_create.length, 2, 'appUsers_create must receive 2 arguments only');

        assert.isDefined(api.appUsers_update, 'appUsers_update function is not exists');
        assert.isFunction(api.appUsers_update, 'appUsers_update must be a function');
        assert.equal(api.appUsers_update.length, 2, 'appUsers_update must receive 2 arguments only');

        assert.isDefined(api.chats_getListWithLastMessageOrderByLastMessageCreatedAsc, 'chats_getListWithLastMessageOrderByLastMessageCreatedAsc function is not exists');
        assert.isFunction(api.chats_getListWithLastMessageOrderByLastMessageCreatedAsc, 'chats_getListWithLastMessageOrderByLastMessageCreatedAsc must be a function');
        assert.equal(api.chats_getListWithLastMessageOrderByLastMessageCreatedAsc.length, 2, 'chats_getListWithLastMessageOrderByLastMessageCreatedAsc must receive 2 arguments only');

        assert.isDefined(api.chats_isExists, 'chats_isExists function is not exists');
        assert.isFunction(api.chats_isExists, 'chats_isExists must be a function');
        assert.equal(api.chats_isExists.length, 2, 'chats_isExists must receive 2 arguments only');

        assert.isDefined(api.chats_getAppId, 'chats_getAppId function is not exists');
        assert.isFunction(api.chats_getAppId, 'chats_getAppId must be a function');
        assert.equal(api.chats_getAppId.length, 2, 'chats_getAppId must receive 2 arguments only');

        assert.isDefined(api.chats_isUserTheCreator, 'chats_isUserTheCreator function is not exists');
        assert.isFunction(api.chats_isUserTheCreator, 'chats_isUserTheCreator must be a function');
        assert.equal(api.chats_isUserTheCreator.length, 2, 'chats_isUserTheCreator must receive 2 arguments only');

        assert.isDefined(api.chats_getNumberOfUnreadMessagesPerChatForUser, 'chats_getNumberOfUnreadMessagesPerChatForUser function is not exists');
        assert.isFunction(api.chats_getNumberOfUnreadMessagesPerChatForUser, 'chats_getNumberOfUnreadMessagesPerChatForUser must be a function');
        assert.equal(api.chats_getNumberOfUnreadMessagesPerChatForUser.length, 2, 'chats_getNumberOfUnreadMessagesPerChatForUser must receive 2 arguments only');

        assert.isDefined(api.chats_getLastMessagePerChat, 'chats_getLastMessagePerChat function is not exists');
        assert.isFunction(api.chats_getLastMessagePerChat, 'chats_getLastMessagePerChat must be a function');
        assert.equal(api.chats_getLastMessagePerChat.length, 2, 'chats_getLastMessagePerChat must receive 2 arguments only');

        assert.isDefined(api.chats_getParticipantsInfo, 'chats_getParticipantsInfo function is not exists');
        assert.isFunction(api.chats_getParticipantsInfo, 'chats_getParticipantsInfo must be a function');
        assert.equal(api.chats_getParticipantsInfo.length, 2, 'chats_getParticipantsInfo must receive 2 arguments only');

        assert.isDefined(api.chats_createWithMessage, 'chats_createWithMessage function is not exists');
        assert.isFunction(api.chats_createWithMessage, 'chats_createWithMessage must be a function');
        assert.equal(api.chats_createWithMessage.length, 2, 'chats_createWithMessage must receive 2 arguments only');


        assert.isDefined(api.messagesGetListForChatOrderByCreatedAsc, 'messagesGetListForChatOrderByCreatedAsc function is not exists');
        assert.isFunction(api.messagesGetListForChatOrderByCreatedAsc, 'messagesGetListForChatOrderByCreatedAsc must be a function');
        assert.equal(api.messagesGetListForChatOrderByCreatedAsc.length, 2, 'messagesGetListForChatOrderByCreatedAsc must receive 2 arguments only');

        assert.isDefined(api.messagesGetIsReadPerMessageForUser, 'messagesGetIsReadPerMessageForUser function is not exists');
        assert.isFunction(api.messagesGetIsReadPerMessageForUser, 'messagesGetIsReadPerMessageForUser must be a function');
        assert.equal(api.messagesGetIsReadPerMessageForUser.length, 2, 'messagesGetIsReadPerMessageForUser must receive 2 arguments only');

        assert.isDefined(api.messagesSetIsReadInChatForUser, 'messagesSetIsReadInChatForUser function is not exists');
        assert.isFunction(api.messagesSetIsReadInChatForUser, 'messagesSetIsReadInChatForUser must be a function');
        assert.equal(api.messagesSetIsReadInChatForUser.length, 2, 'messagesSetIsReadInChatForUser must receive 2 arguments only');

        assert.isDefined(api.messageCreate, 'messageCreate function is not exists');
        assert.isFunction(api.messageCreate, 'messageCreate must be a function');
        assert.equal(api.messageCreate.length, 2, 'messageCreate must receive 2 arguments only');
    });

    it('Check domain is exists', function () {
        assert.isDefined(domain, 'Domain is not defined');
        assert.isDefined(domain.errors, 'Domain errors are not defined');
        assert.isDefined(domain.platforms, 'Domain platforms are not defined');
    });

});