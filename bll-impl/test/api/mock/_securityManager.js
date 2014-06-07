/**
 * Created by UAS on 07.06.2014.
 */

"use strict";


var md5 = require('./_md5');


var SecurityManager = function() {

};

SecurityManager.prototype.getAccessTokenExpireTimeForServiceUser = function(done) {
    done(null, new Date('2020-01-01 00:00:00 +00:00').getTime());
};

SecurityManager.prototype.getAccessTokenExpireTimeForAppUser = function(done) {
    done(null, new Date('2020-01-01 00:00:00 +00:00').getTime());
};

SecurityManager.prototype.getExpireTimeForRegister = function (done) {
    done(null, new Date('2020-01-01 00:00:00 +00:00').getTime());
};

SecurityManager.prototype.getExpireTimeForPasswordReset = function (done) {
    done(null, new Date('2020-01-01 00:00:00 +00:00').getTime());
};

SecurityManager.prototype.hashServiceUserPassword = function(password, done) {
    try {
        done(null, md5(password));
    } catch (err) {
        done(err);
    }
};

SecurityManager.prototype.hashAppUserPassword = function(password, done) {
    try {
        done(null, md5(password));
    } catch (err) {
        done(err);
    }
};


module.exports = SecurityManager;