/**
 * Created by UAS on 10.05.2014.
 */

"use strict";


var bllDef = require('../../../');
var Api = bllDef.api;

var Dal = require('./_dal');
var dataBuilder = require('./_data');
var Uuid = require('./_uuid');
var ConfigManager = require('./_configManager');
var NotificationsManager = require('./_notificationsManager');
var SecurityManager = require('./_securityManager');


module.exports = {

    newApiWithMock: function(override) {
        if (!override) {
            override = {};
        }

        var data = dataBuilder.getCopy();
        var dal = new Dal(data);
        var uuid = new Uuid();
        var configManager = new ConfigManager();
        var notificationsManager = new NotificationsManager();
        var securityManager = new SecurityManager();

        var env = {
            dal: override.dal || dal,
            uuid: override.uuid || uuid,
            configManager: override.configManager || configManager,
            notificationsManager: override.notificationsManager || notificationsManager,
            securityManager: override.securityManager || securityManager
        };
        return {
            dal: env.dal,
            uuid: env.uuid,
            data: data,
            configManager: env.configManager,
            notificationsManager: env.notificationsManager,
            securityManager: env.securityManager,
            api: new Api(env)
        };
    }

};