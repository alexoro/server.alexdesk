/**
 * Created by UAS on 10.06.2014.
 */

"use strict";


var fs = require('fs');
var async = require('async');
var pg = require('pg');

var Api = require('../../src').api;

var dbClearCommands = fs.readFileSync(__dirname + '/_sql_clear.sql').toString().split(';');
var dbMockDataCommnds = fs.readFileSync(__dirname + '/_sql_data.sql').toString().split(';');


module.exports = {

    _configPostgres: {
        host: '192.168.127.129',
        port: 5432,
        user: 'uas',
        password: '488098',
        db: 'test'
    },

    newApiWithMock: function(override) {
        if (!override) {
            override = {};
        }

        var env = {
            _configPostgres: override._configPostgres || this._configPostgres
        };
        return {
            api: new Api(env)
        };
    },

    executeOnClearDb: function (task, doneTask) {
        var i;
        var fnStack = [];
        var dsn = 'postgres://' +
            this._configPostgres.user + ':' +
            this._configPostgres.password + '@' +
            this._configPostgres.host + ':' +
            this._configPostgres.port + '/' +
            this._configPostgres.db;

        // default callback for each sql-query
        var fnDefaultCb = function (client, cb) {
            return function (err) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, client);
                }
            };
        };

        // truncate all tables and data
        for (i = 0; i < dbClearCommands.length; i++) {
            (function(e) {
                fnStack.push(function(client, cb) {
                    client.query(e, fnDefaultCb(client, cb));
                });
            })(dbClearCommands[i]);
        }

        // create test data
        for (i = 0; i < dbMockDataCommnds.length; i++) {
            (function(e) {
                fnStack.push(function(client, cb) {
                    client.query(e, fnDefaultCb(client, cb));
                });
            })(dbMockDataCommnds[i]);
        }

        // put the test task after the test environment is created
        fnStack.push(function (client, cb) {
            try {
                task(function (err) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, client);
                    }
                });
            } catch (err) {
                cb(err);
            }
        });

        // connect to db
        pg.connect(dsn, function(err, client, doneClient) {
            if (err) {
                return doneTask(err);
            }

            // put the waterfall initial task before all tasks
            fnStack.unshift(function (cb) {
                cb(null, client);
            });

            // execute the test
            async.waterfall(
                fnStack,
                function (errStack) { // callback after all commands
                    // clear the test database
                    fnStack = [
                        function (cb) {
                            cb(null, client);
                        }
                    ];
                    for (i = 0; i < dbClearCommands.length; i++) {
                        (function(e) {
                            fnStack.push(function(client, cb) {
                                client.query(e, fnDefaultCb(client, cb));
                            });
                        })(dbClearCommands[i]);
                    }

                    // clear all and return
                    async.waterfall(
                        fnStack,
                        function (errClear) {
                            doneClient();
                            doneTask(errClear || errStack);
                        }
                    );
                }
            );
        });
    }

};