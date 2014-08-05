/**
 * Created by UAS on 05.08.2014.
 */

"use strict";


var Log = function () {

};

Log.prototype.info = function (msg) {
    console.log(this._nowStr() + ' INFO: ' + msg);
};

Log.prototype.warn = function (msg) {
    console.log(this._nowStr() + ' WARN: ' + msg);
};

Log.prototype.err = function (msg) {
    console.log(this._nowStr() + ' ERROR: ' + msg);
};

Log.prototype._nowStr = function () {
    return new Date().toISOString();
};


module.exports = Log;