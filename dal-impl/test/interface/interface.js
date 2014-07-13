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

        assert.isDefined(api.authTokenGetUserInfoByToken, 'authTokenGetUserInfoByToken function is not exists');
        assert.isFunction(api.authTokenGetUserInfoByToken, 'authTokenGetUserInfoByToken must be a function');
        assert.equal(api.authTokenGetUserInfoByToken.length, 2, 'authTokenGetUserInfoByToken must receive 2 arguments only');

        assert.isDefined(api.authTokenCreate, 'authTokenCreate function is not exists');
        assert.isFunction(api.authTokenCreate, 'authTokenCreate must be a function');
        assert.equal(api.authTokenCreate.length, 2, 'authTokenCreate must receive 2 arguments only');


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

        assert.isDefined(api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc, 'chatsGetListWithLastMessageOrderByLastMessageCreatedAsc function is not exists');
        assert.isFunction(api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc, 'chatsGetListWithLastMessageOrderByLastMessageCreatedAsc must be a function');
        assert.equal(api.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc.length, 2, 'chatsGetListWithLastMessageOrderByLastMessageCreatedAsc must receive 2 arguments only');

        assert.isDefined(api.chatIsExists, 'chatIsExists function is not exists');
        assert.isFunction(api.chatIsExists, 'chatIsExists must be a function');
        assert.equal(api.chatIsExists.length, 2, 'chatIsExists must receive 2 arguments only');

        assert.isDefined(api.chatGetAppId, 'chatGetAppId function is not exists');
        assert.isFunction(api.chatGetAppId, 'chatGetAppId must be a function');
        assert.equal(api.chatGetAppId.length, 2, 'chatGetAppId must receive 2 arguments only');

        assert.isDefined(api.chatIsUserTheCreator, 'chatIsUserTheCreator function is not exists');
        assert.isFunction(api.chatIsUserTheCreator, 'chatIsUserTheCreator must be a function');
        assert.equal(api.chatIsUserTheCreator.length, 2, 'chatIsUserTheCreator must receive 2 arguments only');

        assert.isDefined(api.chatsGetNumberOfUnreadMessagesPerChatForUser, 'chatsGetNumberOfUnreadMessagesPerChatForUser function is not exists');
        assert.isFunction(api.chatsGetNumberOfUnreadMessagesPerChatForUser, 'chatsGetNumberOfUnreadMessagesPerChatForUser must be a function');
        assert.equal(api.chatsGetNumberOfUnreadMessagesPerChatForUser.length, 2, 'chatsGetNumberOfUnreadMessagesPerChatForUser must receive 2 arguments only');

        assert.isDefined(api.chatsGetLastMessagePerChat, 'chatsGetLastMessagePerChat function is not exists');
        assert.isFunction(api.chatsGetLastMessagePerChat, 'chatsGetLastMessagePerChat must be a function');
        assert.equal(api.chatsGetLastMessagePerChat.length, 2, 'chatsGetLastMessagePerChat must receive 2 arguments only');

        assert.isDefined(api.chatGetParticipantsInfo, 'chatGetParticipantsInfo function is not exists');
        assert.isFunction(api.chatGetParticipantsInfo, 'chatGetParticipantsInfo must be a function');
        assert.equal(api.chatGetParticipantsInfo.length, 2, 'chatGetParticipantsInfo must receive 2 arguments only');

        assert.isDefined(api.chatCreateWithMessage, 'chatCreateWithMessage function is not exists');
        assert.isFunction(api.chatCreateWithMessage, 'chatCreateWithMessage must be a function');
        assert.equal(api.chatCreateWithMessage.length, 2, 'chatCreateWithMessage must receive 2 arguments only');


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