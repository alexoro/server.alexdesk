/**
 * Created by UAS on 23.04.14.
 */

"use strict";

var fs = require('fs');
var async = require('async');
var assert = require('chai').assert;
var qeFn = require('../src/QueryExecutor');
var dsn = require('./_cfg').dsn;


process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});


describe.skip('DAL API', function() {
    var qe = new qeFn(dsn);

    var schemaName = 'test';

    var createTestDatabase = function(doneFn) {
        var gClient;
        var gDoneClient;

        var fnStack = [
            function(cb) {
                qe.execute(function(err, client, doneClient) {
                    gClient = client;
                    gDoneClient = doneClient;
                    return cb(err);
                });
            },
            function(cb) {
                gClient.query('CREATE SCHEMA ' + schemaName, cb);
            },
            function(cb) {
                gClient.query('SET search_path TO ' + schemaName, cb);
            }
        ];

        try {
            var tablesSqls = fs.readFileSync(__dirname + '/_db_schema.sql').toString().split(';');
            tablesSqls.forEach(function(item) {
                fnStack.push(function(cb) {
                    gClient.query(item, cb);
                });
            });
        } catch (err) {
            if (gDoneClient) {
                gDoneClient(gClient);
            }
            return doneFn(err);
        }

        try {
            var testSqls = fs.readFileSync(__dirname + '/_db_test.sql').toString().split(';');
            testSqls.forEach(function(item) {
                fnStack.push(function(cb) {
                    gClient.query(item, cb);
                });
            });
        } catch (err) {
            if (gDoneClient) {
                gDoneClient(gClient);
            }
            return doneFn(err);
        }

        async.series(
            fnStack,
            function(err) {
                if (gDoneClient) {
                    gDoneClient(gClient);
                }
                doneFn(err);
            }
        );
    };

    var destroyTestDatabase = function(doneFn) {
        var gClient;
        var gDoneClient;

        var fnStack = [
            function(cb) {
                qe.execute(function(err, client, doneClient) {
                    gClient = client;
                    gDoneClient = doneClient;
                    return cb(err);
                });
            },
            function(cb) {
                gClient.query('DROP SCHEMA IF EXISTS ' + schemaName + ' CASCADE', cb);
            }
        ];

        async.series(
            fnStack,
            function(err) {
                if (gDoneClient) {
                    gDoneClient(gClient);
                }
                doneFn(err);
            }
        );
    };


    before(function(doneTest) {
        var fnStack = [
            function(cb) {
                destroyTestDatabase(function(err) {
                    assert.notOk(err, 'Unable to prepare/clear the test database: ' + err);
                    return cb(err);
                });
            },
            function(cb) {
                createTestDatabase(function(err) {
                    if (err) {
                        destroyTestDatabase(function(err2) {
                            assert.notOk(err, 'Unable to destroy the test database after failure of it\'s creation: ' + err2);
                            return cb(err);
                        });
                        assert.notOk(err, 'Unable to create test database: ' + err);
                    }
                    return cb(err);
                });
            }
        ];

        async.series(
            fnStack,
            function(err) {
                doneTest(err);
            }
        );
    });

    it('Smth', function() {
        // проверь с new Error + иконка теста какая будет? Кирпич или знак?
    });

    after(function(doneTest) {
        destroyTestDatabase(function(err) {
            assert.notOk(err, 'Unable to destroy the test database: ' + err);
            doneTest(err);
        });
    });
});