/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var regexpGuid = new RegExp("^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$");
var regexpEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {

    guid: function(value) {
        return (typeof value === 'string') && value.match(regexpGuid);
    },

    accessToken: function(value) {
        return this.guid(value);
    },

    email: function(value) {
        return (typeof value === 'string') && value.match(regexpEmail);
    },

    app_user_login: function(value) {
        return (typeof value === 'string') && value.length >= 1 && value.length <= 64;
    },

    app_user_password: function(value) {
        return (typeof value === 'string') && value.length >= 1 && value.length <= 64;
    }

};