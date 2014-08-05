/**
 * Created by UAS on 10.05.2014.
 */

"use strict";


var bllDef = require('../../../');
var Api = bllDef.api;

var Dal = require('./_dal');
var dataBuilder = require('./_data');
var Uuid = require('./_uuid');
var ConfigProvider = require('./_configProvider');
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
        var configProvider = new ConfigProvider();
        var notificationsManager = new NotificationsManager();
        var securityManager = new SecurityManager();

        var env = {
            dal: override.dal || dal,
            uuid: override.uuid || uuid,
            configProvider: override.configProvider || configProvider,
            notificationsManager: override.notificationsManager || notificationsManager,
            securityManager: override.securityManager || securityManager
        };
        return {
            dal: env.dal,
            uuid: env.uuid,
            data: data,
            configProvider: env.configProvider,
            notificationsManager: env.notificationsManager,
            securityManager: env.securityManager,
            api: new Api(env)
        };
    }

};