/**
 * Created by UAS on 05.08.2014.
 */

"use strict";

var numCPUs = require('os').cpus().length;


module.exports = {

    allInOneServer: {

        testLongLiveDebug: {
            dbPostgres: {
                user: 'uas',
                password: '488098',
                host: '192.168.127.129',
                port: '5432',
                db: 'alexdesk_test_longlive'
            },

            accessTokenForServiceUserLifeTimeInMillis: 30 * 24 * 60 * 60 * 1000,
            accessTokenForAppUserLifeTimeInMillis: 700 * 24 * 60 * 60 * 1000,
            registerTokenLifeTimeInMillis: 1 * 24 * 60 * 60 * 1000,
            resetPasswordTokenLifeTimeInMillis: 1 * 6 * 60 * 60 * 1000,

            appAndServiceUserHashingAlgorithm: 'md5',
            saltForAppUserPasswordHash: ':V&f-_z*d5+e(Q3B-$;v6%R;3XYxOLkS',
            saltForServiceUserPasswordHash: '{9-$Lx^j=SH)^"])U$?Kupv4[/$_ox&a',

            uuidEpochBeginDate: new Date('2014-06-06 00:00:00 +00:00'),
            uuidShardId: 0,
            clusterNodes: 1
        },

        testLongLiveProduction: {
            dbPostgres: {
                user: 'uas',
                password: '488098',
                host: '192.168.127.129',
                port: '5432',
                db: 'alexdesk_test_longlive'
            },

            accessTokenForServiceUserLifeTimeInMillis: 30 * 24 * 60 * 60 * 1000,
            accessTokenForAppUserLifeTimeInMillis: 700 * 24 * 60 * 60 * 1000,
            registerTokenLifeTimeInMillis: 1 * 24 * 60 * 60 * 1000,
            resetPasswordTokenLifeTimeInMillis: 1 * 6 * 60 * 60 * 1000,

            appAndServiceUserHashingAlgorithm: 'md5',
            saltForAppUserPasswordHash: ':V&f-_z*d5+e(Q3B-$;v6%R;3XYxOLkS',
            saltForServiceUserPasswordHash: '{9-$Lx^j=SH)^"])U$?Kupv4[/$_ox&a',

            uuidEpochBeginDate: new Date('2014-06-06 00:00:00 +00:00'),
            uuidShardId: 0,
            clusterNodes: numCPUs
        }

    }

};