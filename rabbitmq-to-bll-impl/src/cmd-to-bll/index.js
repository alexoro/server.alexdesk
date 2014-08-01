/**
 * Created by UAS on 01.08.2014.
 */

"use strict";


var Mapper = function () {
    this._ver2bll = {};
};

Mapper.prototype.setBllForApiVersion = function (version, bll) {
    this._ver2bll[version] = bll;
};

Mapper.prototype.getBllForApiVersion = function (version) {
    var ret = this._ver2bll[version];
    return ret ? ret : null;
};

Mapper.prototype.executeBllMethodFromEncodedReturnEncoded = function (encoded, cb) {
    var json;
    try {
        json = JSON.parse(encoded);
        if (!json) {
            return cb(new Error('Message from queue is not a object: ' + encoded));
        }
    } catch (ex) {
        return cb(new Error('Unable to parse message from queue: ' + encoded));
    }

    if (!json.version) {
        return cb(new Error('BLL version is not defined in message from queue: ' + encoded));
    }
    if (!json.method) {
        return cb(new Error('Method is not defined in message from queue: ' + encoded));
    }
    if (!json.args) {
        return cb(new Error('Args is not defined in message from queue: ' + encoded));
    }

    var bll = this.getBllForApiVersion(json.version);
    if (!bll) {
        return cb(new Error('BLL is not defined for message from queue: ' + encoded));
    }
    if (!bll[json.method]) {
        return cb(new Error('BLL is not supporting method (not defined) for message from queue: ' + encoded));
    }
    if (typeof bll[json.method] !== 'function') {
        return cb(new Error('BLL is not supporting method (not a method) for message from queue: ' + encoded));
    }

    return bll[json.method](json.args, function (err, result) {
        if (err) {
            cb(JSON.stringify({
                version: json.version,
                error: err,
                result: null
            }));
        } else {
            cb(JSON.stringify({
                version: json.version,
                error: null,
                result: result
            }));
        }
    });
};


module.exports = Mapper;