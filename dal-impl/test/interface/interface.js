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


        assert.isDefined(api.serviceUsers_getCredentialsByLogin, 'serviceUsers_getCredentialsByLogin function is not exists');
        assert.isFunction(api.serviceUsers_getCredentialsByLogin, 'serviceUsers_getCredentialsByLogin must be a function');
        assert.equal(api.serviceUsers_getCredentialsByLogin.length, 2, 'serviceUsers_getCredentialsByLogin must receive 2 arguments only');

        assert.isDefined(api.serviceUsers_getProfileById, 'serviceUsers_getProfileById function is not exists');
        assert.isFunction(api.serviceUsers_getProfileById, 'serviceUsers_getProfileById must be a function');
        assert.equal(api.serviceUsers_getProfileById.length, 2, 'serviceUsers_getProfileById must receive 2 arguments only');

        assert.isDefined(api.serviceUsers_create, 'serviceUsers_create function is not exists');
        assert.isFunction(api.serviceUsers_create, 'serviceUsers_create must be a function');
        assert.equal(api.serviceUsers_create.length, 2, 'serviceUsers_create must receive 2 arguments only');

        assert.isDefined(api.serviceUserUpdatePasswordHash, 'serviceUserUpdatePasswordHash function is not exists');
        assert.isFunction(api.serviceUserUpdatePasswordHash, 'serviceUserUpdatePasswordHash must be a function');
        assert.equal(api.serviceUserUpdatePasswordHash.length, 2, 'serviceUserUpdatePasswordHash must receive 2 arguments only');


        assert.isDefined(api.serviceUsers_registerConfirmDataGet, 'serviceUsers_registerConfirmDataGet function is not exists');
        assert.isFunction(api.serviceUsers_registerConfirmDataGet, 'serviceUsers_registerConfirmDataGet must be a function');
        assert.equal(api.serviceUsers_registerConfirmDataGet.length, 2, 'serviceUsers_registerConfirmDataGet must receive 2 arguments only');

        assert.isDefined(api.serviceUsers_registerConfirmDataCreate, 'serviceUsers_registerConfirmDataCreate function is not exists');
        assert.isFunction(api.serviceUsers_registerConfirmDataCreate, 'serviceUsers_registerConfirmDataCreate must be a function');
        assert.equal(api.serviceUsers_registerConfirmDataCreate.length, 2, 'serviceUsers_registerConfirmDataCreate must receive 2 arguments only');

        assert.isDefined(api.serviceUsers_markAsConfirmed, 'serviceUsers_markAsConfirmed function is not exists');
        assert.isFunction(api.serviceUsers_markAsConfirmed, 'serviceUsers_markAsConfirmed must be a function');
        assert.equal(api.serviceUsers_markAsConfirmed.length, 2, 'serviceUsers_markAsConfirmed must receive 2 arguments only');


        assert.isDefined(api.serviceUsers_resetPasswordConfirmDataGet, 'serviceUsers_resetPasswordConfirmDataGet function is not exists');
        assert.isFunction(api.serviceUsers_resetPasswordConfirmDataGet, 'serviceUsers_resetPasswordConfirmDataGet must be a function');
        assert.equal(api.serviceUsers_resetPasswordConfirmDataGet.length, 2, 'serviceUsers_resetPasswordConfirmDataGet must receive 2 arguments only');

        assert.isDefined(api.serviceUsers_resetPasswordConfirmDataCreate, 'serviceUsers_resetPasswordConfirmDataCreate function is not exists');
        assert.isFunction(api.serviceUsers_resetPasswordConfirmDataCreate, 'serviceUsers_resetPasswordConfirmDataCreate must be a function');
        assert.equal(api.serviceUsers_resetPasswordConfirmDataCreate.length, 2, 'serviceUsers_resetPasswordConfirmDataCreate must receive 2 arguments only');


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

        assert.isDefined(api.chats_getListWithLastMessageOrderByLastMessageCreatedAscForApp, 'chats_getListWithLastMessageOrderByLastMessageCreatedAscForApp function is not exists');
        assert.isFunction(api.chats_getListWithLastMessageOrderByLastMessageCreatedAscForApp, 'chats_getListWithLastMessageOrderByLastMessageCreatedAscForApp must be a function');
        assert.equal(api.chats_getListWithLastMessageOrderByLastMessageCreatedAscForApp.length, 2, 'chats_getListWithLastMessageOrderByLastMessageCreatedAscForApp must receive 2 arguments only');

        assert.isDefined(api.chats_getListWithLastMessageOrderByLastMessageCreatedAscForUser, 'chats_getListWithLastMessageOrderByLastMessageCreatedAscForUser function is not exists');
        assert.isFunction(api.chats_getListWithLastMessageOrderByLastMessageCreatedAscForUser, 'chats_getListWithLastMessageOrderByLastMessageCreatedAscForUser must be a function');
        assert.equal(api.chats_getListWithLastMessageOrderByLastMessageCreatedAscForUser.length, 2, 'chats_getListWithLastMessageOrderByLastMessageCreatedAscForUser must receive 2 arguments only');

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


        assert.isDefined(api.messages_getListForChatOrderByCreatedAsc, 'messages_getListForChatOrderByCreatedAsc function is not exists');
        assert.isFunction(api.messages_getListForChatOrderByCreatedAsc, 'messages_getListForChatOrderByCreatedAsc must be a function');
        assert.equal(api.messages_getListForChatOrderByCreatedAsc.length, 2, 'messages_getListForChatOrderByCreatedAsc must receive 2 arguments only');

        assert.isDefined(api.messages_getIsReadPerMessageForUser, 'messages_getIsReadPerMessageForUser function is not exists');
        assert.isFunction(api.messages_getIsReadPerMessageForUser, 'messages_getIsReadPerMessageForUser must be a function');
        assert.equal(api.messages_getIsReadPerMessageForUser.length, 2, 'messages_getIsReadPerMessageForUser must receive 2 arguments only');

        assert.isDefined(api.messages_setIsReadInChatForUser, 'messages_setIsReadInChatForUser function is not exists');
        assert.isFunction(api.messages_setIsReadInChatForUser, 'messages_setIsReadInChatForUser must be a function');
        assert.equal(api.messages_setIsReadInChatForUser.length, 2, 'messages_setIsReadInChatForUser must receive 2 arguments only');

        assert.isDefined(api.messages_create, 'messages_create function is not exists');
        assert.isFunction(api.messages_create, 'messages_create must be a function');
        assert.equal(api.messages_create.length, 2, 'messages_create must receive 2 arguments only');
    });

    it('Check domain is exists', function () {
        assert.isDefined(domain, 'Domain is not defined');
        assert.isDefined(domain.errors, 'Domain errors are not defined');
        assert.isDefined(domain.platforms, 'Domain platforms are not defined');
    });

});