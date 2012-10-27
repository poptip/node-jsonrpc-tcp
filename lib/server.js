/**
 * Module dependencies.
 */
var net = require('net')
  , util = require('util')
  , Connection = require('./connection');


/**
 * Create a new JSON-RPC server.
 *
 * Creates a new JSON-RPC over TCP server.  The optional `clientListener`
 * argument is automatically set as a listener for the 'client' event.
 *
 *
 * Examples:
 *
 *     var server = new Server();
 *
 *     var server = new Server(function(client, remote) {
 *       remote.call('hello', 'Hello Client');
 *     });
 *
 * @param {Function} clientListener
 * @return {Server}
 * @api public
 */
function Server() {
  net.Server.call(this);
  this._services = [];
  
  var self = this;
  this.addListener('connection', function(socket) {
    var connection = new Connection(socket);
    // Services exposed on the server as a whole are propagated to each
    // connection.  Flexibility exists to expose services on a per-connection
    // basis as well.
    self._services.forEach(function(service) {
      connection.expose(service.name, service.service);
    });
  });
}

/**
 * Inherit from `net.Server`.
 */
util.inherits(Server, net.Server);

/**
 * Expose a service.
 *
 * Examples:
 *
 *     server.expose('echo', function(text, result) {
 *       return result(null, text);
 *     });
 *
 * @param {String} name
 * @param {Function|Object} service
 * @api public
 */
Server.prototype.expose = function(name, service) {
  this._services.push({ name: name, service: service });
};


/**
 * Export `Server`.
 */
module.exports = Server;
