/**
 * Created by UAS on 10.06.2014.
 */

"use strict";


var Api = require('../../src').api;


module.exports = {

    _config: {

    },

    newApiWithMock: function(override) {
        if (!override) {
            override = {};
        }

        var env = {
            config: override.config || this._config
        };
        return {
            api: new Api(env)
        };
    }

};