/**
 * Created by UAS on 12.06.2014.
 */

"use strict";


var assert = require('chai').assert;

var mock = require('./mock');


describe('DAL::appCreate', function () {

    it('Must work', function (doneTest) {
        var api = mock.newApiWithMock().api;
        mock.executeOnClearDb(function (doneExecute) {
            api.appCreate({}, function (err) {
                assert.isNotNull(err);
                doneExecute();
            });
        }, doneTest);
    });

});