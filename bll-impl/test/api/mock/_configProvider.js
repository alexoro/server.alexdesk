/**
 * Created by UAS on 15.05.2014.
 */

"use strict";


var ConfigProvider = function() {

};

ConfigProvider.prototype.getCurrentDateUtc = function(done) {
    done(null, new Date('2014-05-15 00:00:00 +00:00'));
};


module.exports = ConfigProvider;