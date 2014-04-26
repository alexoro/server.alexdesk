/**
 * Created by UAS on 23.04.14.
 */

var assert = require('chai').assert;
var qeFn = require('../src/QueryExecutor');

var dsn = "postgres://uas:488098@192.168.127.129:5432/test";


describe('Connection logic', function() {
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