/**
 * Created by UAS on 05.08.2014.
 */

"use strict";


var Bll = require('../../bll-impl').api;
var Dal = require('../../dal-impl').api;
var Uuid = require('../../uuid-generator');
var JsonRpcServer = require('../../www-json-api-v1.0-impl');

var SecurityManager = require('./SecurityManager');
var ConfigProvider = require('./ConfigProvider');
var NotificationsManager = require('./NotificationsManager');


var bll = new Bll({
    dal: new Dal({
        configPostgres: {
            user: 'uas',
            password: '488098',
            host: '192.168.127.129',
            port: '5432',
            db: 'test'
        }
    }),
    uuid: new Uuid(),
    securityManager: new SecurityManager(),
    configProvider: new ConfigProvider(),
    notificationsManager: new NotificationsManager()
});

var jsonRpcServer = new JsonRpcServer({
    port: 3000,
    bll: bll,
    log: null
});

jsonRpcServer.start();