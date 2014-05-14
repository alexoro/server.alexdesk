/**
 * Created by UAS on 10.05.2014.
 */

"use strict";

var bllDef = require('../../../');
var Api = bllDef.api;

var Dal = require('./_dal');
var dataBuilder = require('./_data');
var Uuid = require('./_uuid');
var AccessTokenConfig = require('./_accessTokenConfig');
var PasswordManager = require('./_passwordManager');
var CurrentTimeProvider = require('./_currentTimeProvider');


module.exports = {

    newApiWithMock: function(override) {
        if (!override) {
            override = {};
        }

        var data = dataBuilder.getCopy();
        var dal = new Dal(data);
        var uuid = new Uuid();
        var accessTokenConfig = new AccessTokenConfig();
        var passwordManager = new PasswordManager();
        var currentTimeProvider = new CurrentTimeProvider();

        var env = {
            dal: override.dal || dal,
            uuid: override.uuid || uuid,
            passwordManager: override.passwordManager || passwordManager,
            accessTokenConfig: override.accessTokenConfig || accessTokenConfig,
            currentTimeProvider: override.currentTimeProvider || currentTimeProvider
        };
        return {
            dal: env.dal,
            uuid: env.uuid,
            data: data,
            passwordManager: env.passwordManager,
            accessTokenConfig: env.accessTokenConfig,
            currentTimeProvider: env.currentTimeProvider,
            api: new Api(env)
        };
    }

};