/**
 * Created by UAS on 24.04.2014.
 */

"use strict";

/*
---- Input data:
{
    access_token: "142b2b49-75f2-456f-9533-435bd0ef94c0"
}

---- Output data:
[
    {
        id: "0fd44c33-951a-4f2c-8fb3-6faf41970cb1",
        title: "Test App",
        created: "2012-04-30 12:00:00 +04:00",
        number_of_conversations: 3,
        number_of_all_messages: 8
        number_of_unread_messages: 1,
        platform_type: 2,
        extra: {
            package: 'com.testapp'
        }
    },
    ...
]
*/

var AppsList = function(DAL) {
    this.dal = DAL;
};

AppsList.prototype.execute = function(done) {

};

AppsList.prototype._getUserIdByToken = function(accessToken, done) {

};

AppsList.prototype._getAppsList = function(userId, done) {

};

AppsList.prototype._getNumberOfConversations = function(appIds, done) {

};

AppsList.prototype._getNumberOfAllMessages = function(appIds, done) {

};

AppsList.prototype._getNumberOfUnreadMessages = function(userId, appIds, done) {

};



module.exports = function(args, next) {
    next(null, getResult());
};

function getResult() {
    return [];
}

//var pg = require('pg');
//var RpcErrors = require('./_RpcErrors');
//var Common = require('./_Common');
//var Platforms = require('./_Platforms');


//[{
//    "id": "1",
//    "title": "Test app",
//    "created": 1378243940,
//    "is_agent": false,
//    "number_of_conversations": 10,
//    "number_of_unread_messages": 50
//}, ...]
/*var Clazz = function(args, rpc, env) {
    this.args = args;
    this.rpc = rpc;
    this.cfg = env.cfg;
};

Clazz.prototype.execute = function() {
    var self = this;
    Common.connectToDb(this.cfg.db.dsn, this.rpc, function(client, done) {
        Common.getUserIdByToken(client, self.args.auth_token, function(err, success) {
            if (err) {
                self.rpc.error(RpcErrors.INTERNAL_ERROR, err.toString(), err);
                done();
            } else {
                if (success === '') {
                    self.rpc.error(RpcErrors.USER_NOT_FOUND, "User with specified token is not found");
                    done();
                } else {
                    self._extractApps(client, done, success);
                }
            }
        });
    });
};

Clazz.prototype._extractApps = function(client, done, userId) {
    var rawQuery =
        'SELECT a.id, a.title, extract ("epoch" from a.created)::int AS created, e.package, ' +
        '(SELECT COUNT(*) FROM conversations c WHERE c.app_id = a.id)::int AS number_of_conversations, ' +
        '(SELECT COUNT(*) FROM conversation_message_is_read cmr WHERE ' +
        'user_id = $1 ' +
        'AND is_read = FALSE ' +
        'AND cmr.conversation_message_id IN( ' +
        'SELECT cm.id FROM conversation_messages cm WHERE cm.conversation_id IN( ' +
        'SELECT c1.id FROM conversations c1 WHERE c1.app_id = a.id)) ' +
        ')::int ' +
        'AS number_of_unread_messages '+
        'FROM apps a, app_info_extra_android e ' +
        'WHERE a.owner_user_id = $1 AND e.app_id = a.id';
    var preparedQuery = {
        name: 'apps.list.android',
        text: rawQuery,
        values: [userId]
    };

    var query = client.query(preparedQuery);
    var self = this;

    query.on('row', function(row, result) {
        result.addRow({
            id: row['id'],
            title: row['title'],
            created: row['created'],
            platform_type: Platforms.ANDROID,
            platform_extra: {
                package: row['package']
            },
            number_of_conversations: row['number_of_conversations'],
            number_of_unread_messages: row['number_of_unread_messages']
        });
    });
    query.on('end', function(result) {
        self.rpc.success(result.rows);
        done();
    });
    query.on('error', function(err) {
        self.rpc.error(RpcErrors.INTERNAL_ERROR, err.toString(), err);
        done();
    });
};


module.exports = Clazz;*/