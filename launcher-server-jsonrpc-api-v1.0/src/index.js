/**
 * Created by UAS on 05.08.2014.
 */

"use strict";


var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var Bll = require('../../bll-v1.0-main').api;
var Dal = require('../../bll-v1.0-dal').api;
var Uuid = require('../../bll-v1.0-uuid-generator');
var JsonRpcServer = require('../../server-jsonrpc-api-v1.0');

var cfg = require('./cfg');
var SecurityManager = require('./SecurityManager');
var ConfigProvider = require('./ConfigProvider');
var NotificationsManager = require('./NotificationsManager');
var BllLogger = require('./BllLogger');

var uuid = new Uuid();
var bll = new Bll({
    dal: new Dal({
        configPostgres: {
            user: cfg.dbPostgres.user,
            password: cfg.dbPostgres.password,
            host: cfg.dbPostgres.host,
            port: cfg.dbPostgres.port,
            db: cfg.dbPostgres.db
        }
    }),
    uuid: uuid,
    securityManager: new SecurityManager({
        accessTokenForServiceUserLifeTimeInMillis: cfg.accessTokenForServiceUserLifeTimeInMillis,
        accessTokenForAppUserLifeTimeInMillis: cfg.accessTokenForAppUserLifeTimeInMillis,
        registerTokenLifeTimeInMillis: cfg.registerTokenLifeTimeInMillis,
        resetPasswordTokenLifeTimeInMillis: cfg.resetPasswordTokenLifeTimeInMillis,
        appAndServiceUserHashingAlgorithm: cfg.appAndServiceUserHashingAlgorithm,
        saltForAppUserPasswordHash: cfg.saltForAppUserPasswordHash,
        saltForServiceUserPasswordHash: cfg.saltForServiceUserPasswordHash
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


var uuidEpochBeginMillis = cfg.uuidEpochBeginDate.getTime();
var uuidGetMillisFromEpoch = function (done) {
    return done(null, Date.now() - uuidEpochBeginMillis);
};
uuid.init(cfg.uuidShardId, uuidGetMillisFromEpoch, function (err) {
    /*if (err) {
        console.log('Err uuid init: ' + err.message);
    } else {
        if (cluster.isMaster) {
            // Fork workers.
            for (var i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            cluster.on('exit', function(worker, code, signal) {
                console.log('worker ' + worker.process.pid + ' died');
            });
        } else {
            // Workers can share any TCP connection
            // In this case its a HTTP server
            jsonRpcServer.start();
        }
    }*/
    jsonRpcServer.start();
});