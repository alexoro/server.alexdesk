/**
 * Created by UAS on 15.05.2014.
 */

"use strict";


var ConfigProvider = function() {

};

ConfigProvider.prototype.getCurrentDateUtc = function(done) {
    done(null, new Date());
};


module.exports = ConfigProvider;