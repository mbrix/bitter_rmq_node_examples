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


// Inactive UTXO set

/*
{
  "id": "0.68134818505495790.26844571740366520.2591961605940014",
  "error": {
    "message": "Specified utxo set is not active.",
    "code": 1
  }
*/

// Positive Response

/*
{
  "result": {
    "utxo_id": "satoshidice_utxoset",
    "status": "active",
    "bloom_filter_updated": true
  },
  "id": "0.83908523432910440.72819676483049990.5446719732135534",
  "error": null
}
*/


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
        	var x = JSON.parse(msg.content.toString());
        	console.log(' [.] Got %s', JSON.stringify(x, null, 2));
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
