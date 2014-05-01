/**
 * Created by UAS on 23.04.2014.
 */

"use strict";

var api = require('./_api');
var consts = require('./_consts');
var countries = require('./_countries');
var languages = require('./_languages');

module.exports = {

    api: api,
    platforms: consts.Platforms,
    userTypes: consts.UserTypes,
    chatTypes: consts.ChatTypes,
    chatStatuses: consts.ChatStatuses,

    countries: countries,
    languages: languages

};