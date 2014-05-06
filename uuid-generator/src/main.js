/**
 * Created by UAS on 06.05.2014.
 */

"use strict";

var BigNumber = require('bignumber.js');


var Generator = function() {
    this.minNodeId = 0;
    this.maxNodeId = 255;

    var _delayBeforeStart = 1100; // because we are using algorithm with seconds - lets sleep to avoid collisions after fast restart
    var _nodeId = -1;
    var _self = this;
    var _isInited = false;

    var _startDateMillis = new Date('2014-01-01 00:00:00 +00:00').getTime();
    var _inc = 0;
    var _mod = 1024;

    var _getTimeMillisFunctionDefault = function() {
        return Date.now() - _startDateMillis;
    };

    var _reserved = '0000';
    var _zerofills = {};
    var _nodeIdAsString = '';
    var _getTimeMillisFunction = _getTimeMillisFunctionDefault;
    var _pad = function(str, padToSize) {
        if (str.length === padToSize) {
            return str;
        } else {
            return _zerofills[padToSize - str.length] + str;
        }
    };

    this.overrideGetTimeMillisFunction = function(fn) {
        _getTimeMillisFunction = fn;
    };

    this.init = function(nodeId, done) {
        if (_isInited) {
            return done(new Error('Init was called earlier'));
        }

        if (typeof nodeId !== 'number') {
            return done(new Error('nodeId is not a number'));
        }
        if (nodeId < _self.minNodeId) {
            return done(new Error('nodeId is lower than minNodeId'));
        }
        if (nodeId > _self.maxNodeId) {
            return done(new Error('nodeId is greater than maxNodeId'));
        }

        if (Date.now() < _startDateMillis) {
            return done(new Error('Current PC time is invalid. It must be greater than ' + _startDateMillis));
        }

        setTimeout(function() {
            _isInited = true;

            _zerofills[1] = '0';
            for (var i = 2; i <= 41; i++) {
                _zerofills[i] = '0' + _zerofills[i-1];
            }

            _nodeId = nodeId;
            _nodeIdAsString = _pad(_nodeId.toString(2), 8);

            done(null);
        }, _delayBeforeStart);
    };

    this.newBigInt = function(done) {
        if (!_isInited) {
            return done(new Error('#init did not called'));
        }

        _inc = (_inc + 1) % _mod;

        var millis = _pad(_getTimeMillisFunction().toString(2), 42);
        var incAsStr = _pad(_inc.toString(2), 10);

        try {
            var r = new BigNumber(millis + _reserved + _nodeIdAsString + incAsStr, 2);
            return done(null, r.toString(10));
        } catch (err) {
            return done(new Error('Some invalid params. Cannot generate the ID: ' + err));
        }
    };

    this.newGuid = function(done) {
        if (!_isInited) {
            return done(new Error('#init did not called'));
        }
        done(null, 'x');
    };
};

module.exports = Generator;