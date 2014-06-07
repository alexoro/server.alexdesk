/**
 * Created by UAS on 10.05.2014.
 */

"use strict";


var bllDef = require('../../../');
var Api = bllDef.api;

var Dal = require('./_dal');
var dataBuilder = require('./_data');
var Uuid = require('./_uuid');
var CurrentTimeProvider = require('./_currentTimeProvider');
var EmailSender = require('./_emailSender');
var SecurityManager = require('./_securityManager');


module.exports = {

    newApiWithMock: function(override) {
        if (!override) {
            override = {};
        }

        var data = dataBuilder.getCopy();
        var dal = new Dal(data);
        var uuid = new Uuid();
        var currentTimeProvider = new CurrentTimeProvider();
        var emailSender = new EmailSender();
        var securityManager = new SecurityManager();

        var env = {
            dal: override.dal || dal,
            uuid: override.uuid || uuid,
            currentTimeProvider: override.currentTimeProvider || currentTimeProvider,
            emailSender: override.emailSender || emailSender,
            securityManager: override.securityManager || securityManager
        };
        return {
            dal: env.dal,
            uuid: env.uuid,
            data: data,
            currentTimeProvider: env.currentTimeProvider,
            emailSender: env.emailSender,
            securityManager: env.securityManager,
            api: new Api(env)
        };
    }

};