/**
 * Created by UAS on 23.04.2014.
 */

var Wrapper = function(DAL) {
    this.dal = DAL;
};

Wrapper.prototype.apps_list = function(args, next) {
    return [];
};

Wrapper.prototype.hd_conversationsList = function(args, next) {
    return [];
};

Wrapper.prototype.hd_messageCreate = function(args, next) {
    return {};
};

Wrapper.prototype.hd_messagesList = function(args, next) {
    return [];
};

Wrapper.prototype.security_createAuthToken = function(args, next) {
    return {};
};

Wrapper.prototype.system_getTime = function(args, next) {
    return {};
};

Wrapper.prototype.user_init = function(args, next) {
    return null;
};

Wrapper.prototype.user_register = function(args, next) {

};


module.exports = Wrapper;