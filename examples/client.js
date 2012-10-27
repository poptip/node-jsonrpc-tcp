var jsonrpc = require('jsonrpc-tcp');


var client = jsonrpc.createClient();
client.connect(7000);

client.call('echo', 'Hello World', function(err, result) {
  console.log(err, result);
});

client.call('math.add', 3, 2.1, function(err, result) {
  console.log(err, result);
});

client.on('close', function() {
});
