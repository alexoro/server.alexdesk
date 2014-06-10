/**
 * Created by UAS on 23.04.14.
 */

"use strict";


var DAL = function(config) {

};


DAL.prototype.userGetIdByToken = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.authTokenCreate = function(args, done) {
    done(new Error('Not implemented'));
};


DAL.prototype.serviceUserGetCreditionalsByLogin = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.serviceUserGetProfileById = function (args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.serviceUserCreate = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.serviceUserUpdatePasswordHash = function (args, done) {
    done(new Error('Not implemented'));
};


DAL.prototype.serviceUserGetRegisterConfirmData = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.serviceUserCreateRegisterConfirmData = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.serviceUserMarkAsConfirmed = function(args, done) {
    done(new Error('Not implemented'));
};


DAL.prototype.serviceUserGetResetPasswordConfirmData = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.serviceUserCreateResetPasswordConfirmData = function(args, done) {
    done(new Error('Not implemented'));
};


DAL.prototype.appsGetListForServiceUser = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appIsExists = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appGetOwnerIdForAppById = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appCreate = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appsGetNumberOfChats = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appsGetNumberOfMessages = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appsGetNumberOfUnreadMessages = function(args, done) {
    done(new Error('Not implemented'));
};


DAL.prototype.appUserGetCreditionalsByLogin = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appUsersGetProfileById = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appUsersCreate = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.appUserUpdate = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.chatsGetListWithLastMessageOrderByLastMessageCreatedAsc = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.chatIsExists = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.chatGetAppId = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.chatIsUserTheCreator = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.chatsGetNumberOfUnreadMessagesPerChatForUser = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.chatsGetLastMessagePerChat = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.chatGetParticipantsInfo = function (args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.chatCreateWithMessage = function(args, done) {
    done(new Error('Not implemented'));
};


DAL.prototype.messagesGetListForChatOrderByCreatedAsc = function(args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.messagesGetIsReadPerMessageForUser = function (args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.messagesSetIsReadInChatForUser = function (args, done) {
    done(new Error('Not implemented'));
};

DAL.prototype.messageCreate = function(args, done) {
    done(new Error('Not implemented'));
};


module.exports = DAL;