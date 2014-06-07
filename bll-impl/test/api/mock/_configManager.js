/**
 * Created by UAS on 15.05.2014.
 */

"use strict";


var ConfigManager = function() {

};

ConfigManager.prototype.getCurrentTime = function(done) {
    done(null, new Date('2014-05-15 00:00:00 +00:00'));
};


module.exports = ConfigManager;