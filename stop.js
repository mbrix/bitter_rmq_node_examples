#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// stop_utxo terminates an active utxo set
// The set is persisted on disk, but will stop publishing updates
// to it's associated queue.
//
// method: 'stop_utxo'
// parameters: ['unique_name']
// The only parameter is the unique name

// Queue stopped response

/*
{
  "result": {
    "utxo_id": "satoshidice_utxoset",
    "status": "stopped"
  },
  "id": "0.481126019498333330.75929114152677360.4090469521470368",
  "error": null
}

*/

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
      
   ch.assertQueue('', {exclusive: true}, function(err, q) {
      var corr = generateUuid();
      ch.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == corr) {
        	var x = JSON.parse(msg.content.toString());
        	console.log(' [.] Got %s', JSON.stringify(x, null, 2));
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});

	  StopObj = {method: 'stop_utxo', id: corr,
	  	  params: ['satoshidice_utxoset']},
      ch.sendToQueue('bitter_rpc', new Buffer(JSON.stringify(StopObj)),
      { correlationId: corr, replyTo: q.queue });
   });

   });
});



function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}
