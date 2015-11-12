#!/usr/bin/env node

var amqp = require('amqplib/callback_api');


// Subscribe to updates to response_queue
// which is associated with a utxo set by connect_utxo rpc

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
      
   ch.consume('response_queue', function(msg) {
   	   	   console.log(' [.] Got %s', msg.content.toString());
   }, {noAck: true});


   });
});
