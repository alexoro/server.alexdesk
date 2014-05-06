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

        setTimeout(function() {
            _isInited = true;
            _nodeId = nodeId;
            done(null);
        }, _delayBeforeStart);
    };

    this.newBigInt = function() {

    };

    this.newGuid = function() {

    };
};

module.exports = Generator;