/**
 * Created by UAS on 07.08.2014.
 */

"use strict";


var Logger = function () {

};

Logger.prototype.log = function (severity, tags, value) {
    console.log(new Date().toString() + ' ' + severity + '[' + tags.toString() + ']:' + value.toString());
};

module.exports = Logger;