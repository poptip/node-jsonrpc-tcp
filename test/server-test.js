var vows = require('vows');
var assert = require('assert');
var events = require('events');
var util = require('util');
var Server = require('../lib/server');
var Connection = require('../lib/connection');
var Remote = require('../lib/remote');


function MockSocket() {
  events.EventEmitter.call(this);
}

util.inherits(MockSocket, events.EventEmitter);

MockSocket.prototype.setEncoding = function() {};
MockSocket.prototype.setKeepAlive = function() {};


vows.describe('Server').addBatch({
  
  'server with services exposed': {
    topic: function() {
      var server = new Server();
      server.expose('noop', function(){});
      
      return server;
    },
    
    'when accepting a connection': {
      topic: function(server) {
        var self = this;
        server.on('connection', function(connection) {
          self.callback(null, connection);
        });
        
        process.nextTick(function () {
          var socket = new MockSocket();
          server.emit('connection', socket);
        });
      },
      
      'should emit a connection' : function(err, connection) {
        assert.instanceOf(connection, MockSocket);
      }
    }
  }
  
}).export(module);
