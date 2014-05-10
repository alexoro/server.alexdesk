/**
 * Created by UAS on 06.05.2014.
 */

"use strict";

var BigNumber = require('bignumber.js');
var uuid = require('node-uuid');


var defaultGetMillisSinceEpoch = function(done) {
    done(null, Date.now());
};

var Generator = function() {
    this._getMillisSinceEpochFn = defaultGetMillisSinceEpoch;

    this._delayBeforeStart = 1100; // because we are using algorithm with seconds - lets sleep to avoid collisions after fast restart
    this._nodeId = -1;
    this._isInited = false;

    this._inc = 0;
    this._mod = 1024;

    this._reserved = '0000';
    this._zerofills = {};
    this._nodeIdAsString = '';
    this._incAsStrings = {};
    this._reserved_and_nodeIdAsString = '';
};

Generator.prototype._pad = function(str, padToSize) {
    if (str.length >= padToSize) {
        return str;
    } else {
        return this._zerofills[padToSize - str.length] + str;
    }
};


Generator.prototype.getMinNodeId = function() {
    return 0;
};

Generator.prototype.getMaxNodeId = function() {
    return 255;
};

Generator.prototype.init = function(nodeId, getMillisSinceEpoch, done) {
    var self = this;

    if (this._isInited) {
        return done(new Error('Init was called earlier'));
    }

    if (typeof nodeId !== 'number') {
        return done(new Error('nodeId is not a number'));
    }
    if (nodeId < this.getMinNodeId()) {
        return done(new Error('nodeId is lower than minNodeId'));
    }
    if (nodeId > this.getMaxNodeId()) {
        return done(new Error('nodeId is greater than maxNodeId'));
    }

    if (getMillisSinceEpoch) {
        if (typeof getMillisSinceEpoch !== 'function') {
            return done(new Error('getMillisSinceEpoch must be a function'));
        }
        if (getMillisSinceEpoch.length !== 1) {
            return done(new Error('getMillisSinceEpoch must accept one argument with callback'));
        }
        this._getMillisSinceEpochFn = getMillisSinceEpoch;
    }

    setTimeout(function() {
        self._isInited = true;
        var i = 0;

        self._zerofills[1] = '0';
        for (i = 2; i <= 41; i++) {
            self._zerofills[i] = '0' + self._zerofills[i-1];
        }

        for (i = 0; i < self._mod; i++) {
            self._incAsStrings[i] = self._pad(i.toString(2), 10);
        }

        self._nodeId = nodeId;
        self._nodeIdAsString = self._pad(self._nodeId.toString(2), 8);
        self._reserved_and_nodeIdAsString = self._reserved + self._nodeIdAsString;

        done(null);
    }, this._delayBeforeStart);

};


Generator.prototype.newBigInt = function(done) {
    if (!this._isInited) {
        return done(new Error('#init did not called'));
    }

    var self = this;
    this._getMillisSinceEpochFn(function(err, result) {
        if (err) {
            done(err);
        } else {
            if (!result) {
                done(new Error('getMillisSinceEpoch arg did not respond'));
            } else {
                if (typeof result !== 'number') {
                    return done(new Error('getMillisSinceEpoch did a response with not a number: ' + result));
                }
                if (result < 0) {
                    return done(new Error('getMillisSinceEpoch did a response with negative number: ' + result));
                }

                var binaryResult = result.toString(2);
                if (binaryResult.length > 42) {
                    return done(new Error('getMillisSinceEpoch returned very big response. Result must fit in 42 bits'));
                }

                self._inc = (self._inc + 1) % self._mod;
                var millis = self._pad(binaryResult, 42);
//                var incAsStr = self._pad(self._inc.toString(2), 10);

                var r;
                try {
                    r = new BigNumber(millis + self._reserved_and_nodeIdAsString + self._incAsStrings[self._inc], 2);
                } catch (err) {
                    return done(new Error('Some invalid params. Cannot generate the ID: ' + err));
                }

                return done(null, r.toString(10));
            }
        }
    });
};

Generator.prototype.newGuid4 = function(done) {
    if (!this._isInited) {
        return done(new Error('#init did not called'));
    }

    var guid;
    try {
        guid = uuid.v4();
    } catch (err) {
        return done(err);
    }

    done(null, guid);
};


module.exports = Generator;