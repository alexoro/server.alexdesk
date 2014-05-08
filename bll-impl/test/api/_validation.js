/**
 * Created by UAS on 05.05.2014.
 */

"use strict";


var regexpGuid = new RegExp("^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$");


module.exports = {

    guid: function(value) {
        return (typeof value === 'string') && value.match(regexpGuid);
    }

};