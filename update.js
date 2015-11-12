#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var BloomFilter = require('bloom-filter');

// update_bloom updates the bloom filter for a given utxo set.
//
// method: 'update_bloom'
// parameters: ['unique_name', BloomFilter]
// Unique name is the utxo set identifier given in utxo_connect
// BloomFilter is a serialized instance of a BloomFilter
// i.e filter.toObject()
// https://github.com/bitpay/bloom-filter

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
      
   ch.assertQueue('', {exclusive: true}, function(err, q) {
      var corr = generateUuid();

      var numberOfElements = 100;
      var falsePositiveRate = 0.001;
      var filter = BloomFilter.create(numberOfElements, falsePositiveRate);
      
      // Let's add the Eligius pool donations address
      var a = new Buffer('04e575a31ff4e88ebcb34eb5f4bc928e8d3460bc', 'hex');
      filter.insert(a);

      ch.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == corr) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});

	  RpcObj = {method: 'update_bloom', id: corr,
	  	  params: ['satoshidice_utxoset', filter.toObject()]},
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
