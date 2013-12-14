/**
 * Create a new remote JSON-RPC peer over `connection`.
 *
 * `Remote` provides a convienient abstraction over a JSON-RPC connection,
 * allowing methods to be invoked and responses to be received asynchronously.
 *
 * A `Remote` instance will automatically be created for each connection.  There
 * is no need to do so manually.
 *
 * @api private
 */
function Remote(connection) {
  this.timeout = 30000;
  this._connection = connection;
  this._handlers = {};
  this._requestID = 1;
  
  var self = this;
  this._connection.on('response', function(res) {
    if (res.id === null || res.id === undefined) { return; }
    var handler = self._handlers[res.id];
    if (handler) {
      clearTimeout(handler.tid);
      if (res.error) {
        res.error = new Error(res.error);
        res.error.method = handler.req.method;
        res.error.params = handler.req.params;
      }
      handler.callback.call(self, res.error, res.result);
    }
    delete self._handlers[res.id];
  });
}

/**
 * Call a remote method.
 *
 * The method `name` will be invoked on the remote JSON-RPC peer, with given
 * arguments as `params`.  The optional `callback` will be called when the
 * response is received, carrying the `result` or `err` if an error occurred.
 *
 * Examples:
 *
 *     remote.call('echo', 'Hello World', function(err, result) {
 *       console.log(result);
 *     });
 *
 *     remote.call('math.add', 3, 2, function(err, result) {
 *       console.log(result);
 *     });
 *
 * @param {String} method
 * @param {Mixed} params
 * @param {Function} callback
 * @api public
 */
Remote.prototype.call = function(method, params, callback) {
  params = Array.prototype.slice.call(arguments);
  var method = params.length ? params.shift() : null;
  callback = (params.length && typeof params[params.length - 1] === 'function') ? params.pop() : null;

  var req = {
    id: this._requestID++,
    method: method,
    params: params
  };
  var handler = this._handlers[req.id] = { req: req, callback: callback };
  var args = arguments;
  
  var self = this;
  handler.tid = setTimeout(function onTimeout() {
    if (self._connection.connected) {
      self._connection.emit('timeout', method, params);
    } else {
      // if client not connected, send the rpc call again
      // handler.tid = setTimeout(onTimeout, self.timeout);
      self._connection._queue.push(args);
      delete self._handlers[req.id];
    }
  }, this.timeout);
  
  this._connection.send(req);
};


/**
 * Export `Remote`.
 */
module.exports = Remote;
