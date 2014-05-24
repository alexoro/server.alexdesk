/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var _ = require('underscore');
var async = require('async');

var domain = require('../domain');
var dErr = domain.errors;

var errBuilder = require('./_errorBuilder');
var validate = require('./_validation');
var filter = require('./_filter');


var _validateArgsHasErrors = function(env, args) {
    var dErr = domain.errors;

    if (!args) {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not defined');
    }
    if (typeof args !== 'object') {
        return errBuilder(dErr.INVALID_PARAMS, 'Arguments is not a object');
    }
};

var _create = function(env, args, next) {
    var fnStack = [
        function(cb) {
            var flow = {
                args: args,
                env: env
            };
            cb(null , flow);
        },
        function (flow, cb) {
            cb(new Error('Not implemented'));
        }
    ];

    async.waterfall(
        fnStack,
        function(err, newUser) {
            if (err) {
                next(err);
            } else {
                next(null, newUser);
            }
        }
    );
};


module.exports = function(env, args, next) {
    var argsError = _validateArgsHasErrors(env, args);
    if (argsError) {
        next(argsError, null);
    } else {
        _create(env, args, next);
    }
};