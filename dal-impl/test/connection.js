/**
 * Created by UAS on 27.04.2014.
 */

"use strict";

var assert = require('chai').assert;
var qeFn = require('../src/QueryExecutor');
var dsn = require('./_cfg').dsn;


describe.skip('Connection logic', function() {
    it('Check not-successful connection', function(done) {
        var qe = new qeFn("Invalid dsn");
        qe.execute(function(err, client, doneClient) {
            assert.isNotNull(err, "Successful connection with invalid connection params");
            doneClient(client);
            done();
        });
    });
    it('Check successful connection', function(done) {
        var qe = new qeFn(dsn);
        qe.execute(function(err, client, doneClient) {
            assert.isNull(err, 'Unsuccessful connection with valid connection params');
            doneClient(client);
            done();
        });
    });
});