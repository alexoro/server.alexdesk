/**
 * Created by UAS on 09.05.2014.
 */

"use strict";


var UUID = function() {

};

UUID.prototype.newBigInt = function(done) {
    done(null, '1');
};

UUID.prototype.newGuid4 = function(done) {
    done(null, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
};


module.exports = UUID;