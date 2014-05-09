/**
 * Created by UAS on 10.05.2014.
 */

"use strict";

var md5 = require('./_md5');


var Manager = function() {

};

Manager.prototype.hashServiceUserPassword = function(password, done) {
    md5(password, done);
};

Manager.prototype.hashAppUserPassword = function(password, done) {
    md5(password, done);
};

module.exports = Manager;