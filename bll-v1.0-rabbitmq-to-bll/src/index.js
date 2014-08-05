/**
 * Created by UAS on 24.07.2014.
 */

"use strict";


var Bll2Cmd = require('./cmd-to-bll');
var MqReader = require('./mq-reader');


var Executor = function () {
    this._cmd2Bll = new Bll2Cmd();
    this._mqReader = new MqReader();
    this._mqReader.setCmd2Bll(this._cmd2Bll);
};

Executor.prototype.setBllForApiVersion = function (version, bll) {
    this._cmd2Bll.setBllForApiVersion(version, bll);
};

Executor.prototype.start = function () {
    this._mqReader.start();
};


module.exports = Executor;