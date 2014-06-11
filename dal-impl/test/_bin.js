/**
 * Created by UAS on 11.06.2014.
 */

"use strict";


var mock = require('./mock');


describe('XXX', function () {

    it.only('Must work', function (doneTest) {
        mock.executeOnClearDb(function (done) {
            done();
        }, doneTest);
    });

});