/**
 * Created by UAS on 04.08.2014.
 */

"use strict";

var http = require('http');


var Client = function () {
    this._port = null;
    this._bll = null;
};

Client.prototype.setPort = function (port) {
    this._port = port;
};

Client.prototype.setBll = function (bll) {
    this._bll = bll;
};

Client.prototype.start = function () {
    http.createServer(function (req, res) {

    }).listen(this._port, 'localhost');
};


module.exports = Client;