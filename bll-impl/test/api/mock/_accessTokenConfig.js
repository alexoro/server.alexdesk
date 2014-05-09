/**
 * Created by UAS on 10.05.2014.
 */

"use strict";


var Config = function() {

};

Config.prototype.getExpireTimeForServiceUser = function(done) {
    done(null, new Date('2020-01-01 00:00:00 +00:00').getTime());
};

Config.prototype.getExpireTimeForAppUser = function(done) {
    done(null, new Date('2020-01-01 00:00:00 +00:00').getTime());
};

module.exports = Config;