var vows = require('vows');
var assert = require('assert');
var jsonrpc = require('..');


vows.describe('Module').addBatch({
  
  'jsonrpc-tcp': {
    topic: function() {
      return null;
    },
    'should export Server': function () {
      assert.isFunction(jsonrpc.Server);
    },
    'should export Connection': function () {
      assert.isFunction(jsonrpc.Connection);
    }
  },
  
  'create server': {
    topic: function() {
      return new jsonrpc.createServer();
    },
    
    'should be an instance of Server': function (server) {
      assert.instanceOf(server, jsonrpc.Server);
    }
  },
  
  'create client': {
    topic: function() {
      return new jsonrpc.createClient();
    },
    
    'should be an instance of Connection': function (client) {
      assert.instanceOf(client, jsonrpc.Connection);
    }
  }
  
}).export(module);
