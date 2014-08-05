/**
 * Created by UAS on 05.08.2014.
 */

"use strict";


module.exports = {

    dbPostgres: {
        user: 'uas',
        password: '488098',
        host: '192.168.127.129',
        port: '5432',
        db: 'test'
    },

    accessTokenForServiceUserLifeTimeInMillis: 30 * 24 * 60 * 60 * 1000,
    accessTokenForAppUserLifeTimeInMillis: 700 * 24 * 60 * 60 * 1000,
    registerTokenLifeTimeInMillis: 1 * 24 * 60 * 60 * 1000,
    resetPasswordTokenLifeTimeInMillis: 1 * 6 * 60 * 60 * 1000,

    appAndServiceUserHashingAlgorithm: 'md5',
    saltForAppUserPasswordHash: ':V&f-_z*d5+e(Q3B-$;v6%R;3XYxOLkS',
    saltForServiceUserPasswordHash: '{9-$Lx^j=SH)^"])U$?Kupv4[/$_ox&a'

};