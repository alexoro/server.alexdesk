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

        var env = {
            dal: override.dal || dal,
            uuid: override.uuid || uuid,
            passwordManager: override.passwordManager || passwordManager,
            accessTokenConfig: override.accessTokenConfig || accessTokenConfig
        };
        return {
            dal: env.dal,
            uuid: env.uuid,
            data: data,
            passwordManager: env.passwordManager,
            accessTokenConfig: env.accessTokenConfig,
            api: new Api(env)
        };
    }

};