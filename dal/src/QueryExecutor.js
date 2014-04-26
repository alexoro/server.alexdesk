var pg = require('pg');


var QueryExecutor = function(dsn) {
    this.dsn = dsn;
};

/*var fn = function(err, client, done) {

 };*/

QueryExecutor.prototype.exec = function(fn) {
    this.execute(fn);
};

QueryExecutor.prototype.execute = function(fn) {
    pg.connect(this.dsn, fn);
};

module.exports = QueryExecutor;