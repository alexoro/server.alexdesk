/**
 * Created by UAS on 10.06.2014.
 */

"use strict";


var fs = require('fs');
var async = require('async');
var pg = require('pg');

var Api = require('../../src').api;


module.exports = {

    _config: {
        host: '192.168.127.129',
        port: 5432,
        user: 'uas',
        password: '488098',
        db: 'test',
        schema: 'test'
    },

    newApiWithMock: function(override) {
        if (!override) {
            override = {};
        }

        var env = {
            config: override.config || this._config
        };
        return {
            api: new Api(env)
        };
    },

    executeOnClearDb: function (task, doneTask) {
        var self = this;
        var i;
        var fnStack = [];
        var dsn = 'postgres://' + this._config.user + ':' + this._config.password + '@' + this._config.host + ':' + this._config.port + '/' + this._config.db;
        var sqlSchema;
        var sqlData;

        try {
            sqlSchema = fs.readFileSync(__dirname + '/_sql_schema.sql').toString().split(';');
        } catch (err) {
            return doneTask(err);
        }

        try {
            sqlData = fs.readFileSync(__dirname + '/_sql_data.sql').toString().split(';');
        } catch (err) {
            return doneTask(err);
        }

        var fnDefaultCb = function (client, cb) {
            return function (err) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, client);
                }
            };
        };

        fnStack.push(function (client, cb) {
            client.query('DROP SCHEMA IF EXISTS ' + self._config.schema + ' CASCADE', fnDefaultCb(client, cb));
        });
        fnStack.push(function (client, cb) {
            client.query('CREATE SCHEMA ' + self._config.schema, fnDefaultCb(client, cb));
        });
        fnStack.push(function (client, cb) {
            client.query('SET search_path TO ' + self._config.schema, fnDefaultCb(client, cb));
        });

        for (i = 0; i < sqlSchema.length; i++) {
            (function(e) {
                fnStack.push(function(client, cb) {
                    client.query(e, fnDefaultCb(client, cb));
                });
            })(sqlSchema[i]);
        }
        for (i = 0; i < sqlData.length; i++) {
            (function(e) {
                fnStack.push(function(client, cb) {
                    client.query(e, fnDefaultCb(client, cb));
                });
            })(sqlData[i]);
        }

        fnStack.push(function (client, cb) {
            client.query('SET search_path TO public', fnDefaultCb(client, cb));
        });

        fnStack.push(function (client, cb) {
            task(function (err) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, client);
                }
            });
        });

        pg.connect(dsn, function(err, client, doneClient) {
            if (err) {
                return doneTask(err);
            }

            fnStack.unshift(function (cb) {
                cb(null, client);
            });

            async.waterfall(
                fnStack,
                function (errStack) {
                    client.query('DROP SCHEMA ' + self._config.schema + ' CASCADE', function (errDrop) {
                        doneClient();
                        if (errStack) {
                            doneTask(errStack);
                        } else if (errDrop) {
                            doneTask(errDrop);
                        } else {
                            doneTask();
                        }
                    });
                }
            );
        });
    }

};