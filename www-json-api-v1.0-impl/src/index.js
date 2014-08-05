/**
 * Created by UAS on 04.08.2014.
 */

"use strict";

var http = require('http');
var ConsoleLog = require('./ConsoleLog');


var Client = function (args) {
    args = args || {};
    this._port = args.port;
    this._bll = args.bll;
    this._log = args.log || new ConsoleLog();

    this.INVALID_JSON = -32700;
    this.INVALID_REQUEST = -32600;
    this.METHOD_NOT_FOUND = -32601;
    this.INVALID_PARAMS = -32602;
    this.INTERNAL_ERROR = -32603;
};

Client.prototype.start = function () {
    var self = this;
    http.createServer(function (req, res) {
        var body = "";
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            self._parseAndCall(req, body, res);
        });
    }).listen(this._port, '127.0.0.1');
    this._log.info('Server is started at 127.0.0.1:' + this._port);
};

Client.prototype._parseAndCall = function (req, body, res) {
    if (req.method !== 'POST') {
        return this._sendError(res, null, this.INVALID_JSON, 'Only POST methods are supported');
    }

    var json;
    try {
        json = JSON.parse(body);
    } catch (ex) {
        return this._sendError(res, null, this.INVALID_JSON, 'Unable to parse body as JSON');
    }

    if (typeof json !== 'object') {
        return this._sendError(res, null, this.INVALID_REQUEST, 'Sorry. This implementation supports only one request. Or request is not a object');
    }

    var id = json.id || null;

    if (json.jsonrpc !== '2.0') {
        return this._sendError(res, id, this.INVALID_REQUEST, 'jsonrpc field is not defined or not equals to 2.0');
    }
    if (typeof json.method !== 'string' || json.method.length === 0) {
        return this._sendError(res, id, this.INVALID_REQUEST, 'method field is not a string or empty string');
    }
    if (!json.params) {
        return this._sendError(res, id, this.INVALID_REQUEST, 'params field is not defined');
    }

    if (!this._bll[json.method] || typeof this._bll[json.method] !== 'function') {
        return this._sendError(res, id, this.METHOD_NOT_FOUND, 'Method ' + json.method + ' is not found');
    }

    var self = this;
    this._bll[json.method](json.params, function (err, result) {
        if (err) {
            self._sendError(res, id, err.number || self.INTERNAL_ERROR, err.message);
        } else {
            self._sendResult(res, id, result);
        }
    });
};

Client.prototype._sendError = function (res, id, code, message) {
    var responseBody = JSON.stringify({
        jsonrpc: '2.0',
        id: id,
        error: {
            code: code,
            message: message
        }
    });

    res.writeHead(200, {
        'content-type': 'application/json-rpc',
        'allow': 'post',
        'content-length': Buffer.byteLength(responseBody, 'utf8')
    });
    res.end(responseBody);
};

Client.prototype._sendResult = function (res, id, result) {
    var responseBody = JSON.stringify({
        jsonrpc: '2.0',
        id: id,
        result: result
    });

    res.writeHead(200, {
        'content-type': 'application/json-rpc',
        'allow': 'post',
        'content-length': Buffer.byteLength(responseBody, 'utf8')
    });
    res.end(responseBody);
};


module.exports = Client;