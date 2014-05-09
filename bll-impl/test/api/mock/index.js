/**
 * Created by UAS on 10.05.2014.
 */

"use strict";

var bllDef = require('../../../');
var Api = bllDef.api;

var Dal = require('./_dal');
var dataBuilder = require('./_data');
var Uuid = require('./_uuid');
var cfg = require('./_cfg');

module.exports = {

    newApiWithMock: function(override) {
        if (!override) {
            override = {};
        }

        var data = dataBuilder.getCopy();
        var dal = new Dal(data);
        var uuid = new Uuid();

        var env = {
            dal: override.dal || dal,
            uuid: override.uuid || uuid,
            config: override.config || cfg
        };
        return {
            dal: dal,
            uuid: uuid,
            config: cfg,
            data: data,
            api: new Api(env)
        };
    }

};