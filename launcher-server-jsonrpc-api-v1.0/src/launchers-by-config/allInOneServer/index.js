/**
 * Created by UAS on 05.08.2014.
 */

"use strict";


var cluster = require('cluster');

var Bll = require('../../../../bll-v1.0-main/src/index.js').api;
var Dal = require('../../../../bll-v1.0-dal/src/index.js').api;
var Uuid = require('../../../../bll-v1.0-uuid-generator/src/index.js');
var JsonRpcServer = require('../../../../server-jsonrpc-api-v1.0/src/index.js');

var SecurityManager = require('./SecurityManager');
var ConfigProvider = require('./ConfigProvider');
var NotificationsManager = require('./NotificationsManager');
var BllLogger = require('./BllLogger');


var Launcher = function (cfg) {
    this._cfg = cfg;
};

Launcher.prototype.start = function () {
    var self = this;
    var uuid = new Uuid();
    var bll = new Bll({
        dal: new Dal({
            configPostgres: {
                user: self._cfg.dbPostgres.user,
                password: self._cfg.dbPostgres.password,
                host: self._cfg.dbPostgres.host,
                port: self._cfg.dbPostgres.port,
                db: self._cfg.dbPostgres.db
            }
        }),
        uuid: uuid,
        securityManager: new SecurityManager({
            accessTokenForServiceUserLifeTimeInMillis: self._cfg.accessTokenForServiceUserLifeTimeInMillis,
            accessTokenForAppUserLifeTimeInMillis: self._cfg.accessTokenForAppUserLifeTimeInMillis,
            registerTokenLifeTimeInMillis: self._cfg.registerTokenLifeTimeInMillis,
            resetPasswordTokenLifeTimeInMillis: self._cfg.resetPasswordTokenLifeTimeInMillis,
            appAndServiceUserHashingAlgorithm: self._cfg.appAndServiceUserHashingAlgorithm,
            saltForAppUserPasswordHash: self._cfg.saltForAppUserPasswordHash,
            saltForServiceUserPasswordHash: self._cfg.saltForServiceUserPasswordHash
        }),
        configProvider: new ConfigProvider(),
        notificationsManager: new NotificationsManager(),
        logger: new BllLogger()
    });

    var jsonRpcServer = new JsonRpcServer({
        port: 3000,
        bll: bll,
        log: null
    });


    var uuidEpochBeginMillis = self._cfg.uuidEpochBeginDate.getTime();
    var uuidGetMillisFromEpoch = function (done) {
        return done(null, Date.now() - uuidEpochBeginMillis);
    };
    uuid.init(self._cfg.uuidShardId, uuidGetMillisFromEpoch, function (err) {
        if (err) {
            return console.log('Err uuid init: ' + err.message);
        }

        if (self._cfg.clusterNodes === 1) {
            jsonRpcServer.start();
        } else {
            if (cluster.isMaster) {
                // Fork workers.
                for (var i = 0; i < self._cfg.clusterNodes; i++) {
                    cluster.fork();
                }
                cluster.on('exit', function (worker, code, signal) {
                    console.log('worker ' + worker.process.pid + ' died');
                });
            } else {
                // Workers can share any TCP connection
                // In this case its a HTTP server
                jsonRpcServer.start();
            }
        }
    });
};


module.exports = Launcher;