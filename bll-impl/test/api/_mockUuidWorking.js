/**
 * Created by UAS on 09.05.2014.
 */

"use strict";


module.exports = {
    guid4: '6c1bd09f-ca96-438d-adee-ff4c7c1694ba',

    newBigInt: function(done) {
        done(null, '1');
    },
    newGuid4: function(done) {
        done(null, this.guid4);
    }

};