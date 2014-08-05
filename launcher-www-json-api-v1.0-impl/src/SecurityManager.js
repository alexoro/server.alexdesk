/**
 * Created by UAS on 07.06.2014.
 */

"use strict";


var md5 = require('./_md5');


var SecurityManager = function(outerCfg) {
    this._accessTokenForServiceUserLifeTimeInMillis = outerCfg.accessTokenForServiceUserLifeTimeInMillis || 0;
    this._accessTokenForAppUserLifeTimeInMillis = outerCfg.accessTokenForAppUserLifeTimeInMillis || 0;
    this._registerTokenLifeTimeInMillis = outerCfg.registerTokenLifeTimeInMillis || 0;
    this._resetPasswordTokenLifeTimeInMillis = outerCfg.resetPasswordTokenLifeTimeInMillis || 0;

    this._appAndServiceUserHashingAlgorithm = outerCfg.appAndServiceUserHashingAlgorithm || 'md5';
    this._saltForAppUserPasswordHash = outerCfg.saltForAppUserPasswordHash || '';
    this._saltForServiceUserPasswordHash = outerCfg.saltForServiceUserPasswordHash || '';

    if (this._appAndServiceUserHashingAlgorithm !== 'md5') {
        throw new Error('Only md5 hashing now is supported');
    } else {
        this._passwordHashAlgorithm = md5;
    }
};

SecurityManager.prototype.getAccessTokenExpireTimeForServiceUser = function(done) {
    done(null, new Date(Date.now() + this._accessTokenForServiceUserLifeTimeInMillis));
};

SecurityManager.prototype.getAccessTokenExpireTimeForAppUser = function(done) {
    done(null, new Date(Date.now() + this._accessTokenForAppUserLifeTimeInMillis));
};

SecurityManager.prototype.getExpireTimeForRegister = function (done) {
    done(null, new Date(Date.now() + this._registerTokenLifeTimeInMillis));
};

SecurityManager.prototype.getExpireTimeForPasswordReset = function (done) {
    done(null, new Date(Date.now() + this._resetPasswordTokenLifeTimeInMillis));
};

SecurityManager.prototype.hashServiceUserPassword = function(password, done) {
    try {
        done(null, this._passwordHashAlgorithm(this._saltForServiceUserPasswordHash + password));
    } catch (err) {
        done(err);
    }
};

SecurityManager.prototype.hashAppUserPassword = function(password, done) {
    try {
        done(null, this._passwordHashAlgorithm(this._saltForAppUserPasswordHash + password));
    } catch (err) {
        done(err);
    }
};


module.exports = SecurityManager;