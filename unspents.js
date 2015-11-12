#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// unspents unique_name Depth 
//
// method: 'unspents'
// parameters: ['unique_name', Depth]
// Unique name is the utxo set identifier given in utxo_connect
// Depth filters the result set by number of confirms

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
      
   ch.assertQueue('', {exclusive: true}, function(err, q) {
      var corr = generateUuid();

      ch.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == corr) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});

	  RpcObj = {method: 'unspents', id: corr,
	  	  params: ['satoshidice_utxoset', 6]},
      ch.sendToQueue('bitter_rpc', new Buffer(JSON.stringify(RpcObj)),
      { correlationId: corr, replyTo: q.queue });
   });

   });
});



function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}
