#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var BloomFilter = require('bloom-filter');

// connect_utxo starts a new utxo_set, or connects to a running one

// method: 'connect_utxo'
// parameters: ['unique_name', 'StartHash', BloomFilterObject, 'QueueName']
// unique_name will be used on subsequent rpc calls
// QueueName is the queue that this utxo set will publish updates to

// Queue Created Response
/*
{
  "result": {
    "utxo_id": "satoshidice_utxoset",
    "queue": "response_queue"
  },
  "id": "0.868943422799930.250088789034634830.8864006067160517",
  "error": null
}

*/

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
      
   ch.assertQueue('', {exclusive: true}, function(err, q) {
      var corr = generateUuid();
      var numberOfElements = 3;
      var falsePositiveRate = 0.01;
      var filter = BloomFilter.create(numberOfElements, falsePositiveRate);
      
      // Let's add the 48% Satoshi Dice Address
      var a = new Buffer('06f1b66ffe49df7fce684df16c62f59dc9adbd3f', 'hex');
      filter.insert(a);

      ch.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == corr) {
        	var x = JSON.parse(msg.content.toString());
        	console.log(' [.] Got %s', JSON.stringify(x, null, 2));
        	setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});

	  // Start the utxo set at block 176781, the first appearance of SatoshiDice 48%
	  QueueObj = {method: 'connect_utxo', id: corr,
	  	  params: ['satoshidice_utxoset',
	  	  	  '00000000000002b5fb13b7662a3b3e9b937e3ae9cf2fb8fb89f1358bf7385ca6',
	  	  	  filter.toObject(),
	  	  	  'response_queue']},

	  // bitter_rpc is the name of the inbound rpc queue
      ch.sendToQueue('bitter_rpc', new Buffer(JSON.stringify(QueueObj)),
      { correlationId: corr, replyTo: q.queue });
   });

   });
});



function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}
