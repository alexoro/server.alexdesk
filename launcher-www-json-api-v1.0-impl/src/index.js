/**
 * Created by UAS on 05.08.2014.
 */

"use strict";


var Bll = require('../../bll-impl').api;
var Dal = require('../../dal-impl').api;
var Uuid = require('../../uuid-generator');
var JsonRpcServer = require('../../www-json-api-v1.0-impl');


var bll = new Bll({
    dal: new Dal({
        configPostgres: {
            user: '',
            password: '',
            host: '',
            port: '',
            db: ''
        }
    }),
    uuid: new Uuid(),
    securityManager: null,
    configProvider: null,
    notificationsManager: null
});

var jsonRpcServer = new JsonRpcServer({
    port: 3000,
    bll: bll,
    log: null
});

jsonRpcServer.start();