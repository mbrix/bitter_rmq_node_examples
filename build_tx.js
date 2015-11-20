#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// build_tx unique_name unspents payees change_address Fee
//
// method: 'build_tx'
// parameters: ['unique_name', [[Hash, vOut], [Hash, vOut], [Hash, vOut], [Hash, vOut]], [[TOAddress, ChangeAddress, Color, Value]], ChangeAddress, Fee / "auto"
//
// Unique name is the utxo set identifier given in utxo_connect
// Unspents is an array of arrays, each with the Hash, and vOut of the Unspent to lookup and include in the spendable set
// Payees is an array of arrays, each with the ToAddress, ChangeAddress, Color, and SatoshiValue or ColorValue of that payment
// ChangeAddress is the final uncolored address to send change after the dust and fees have been applied.
// Fee is the fee to apply to this payment, "auto" will use a basic fee per kb calculation. This might be low if the fee calculator is not running on the remote node.

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

	  RpcObj = {method: 'build_tx', id: corr,
	  	  params: ['satoshidice_utxoset',
	  	  	  [["e518d14b5b3a44319608be57b3c74c165d9edd5942b7de97f31f5a64fa067701", 68],
	  	  	  	  ["0633d491f8513f4038b8fa81dbfdfcca92e2c60f8cddf6bcaf4e8244427cc108", 28],
	  	  	      ["051e49db5aacc86b079e5a7aad915cda441a520023908fb5ce4c3671c32438fd", 362],
	  	  	      ["38781e9e641ddcecb3ffe73c9e43c9fae6e99970387df133557d43ccd894a6cf", 303]],
	  	  [["mwHu1wJDHAnb8ULya6UG75NQ8LyL5KLdV1", "mzJsRYNF61dd2YZ1Jysrur3mh8P9q8yw5f", "uncolored", "2000"]],
	  	  "mzJsRYNF61dd2YZ1Jysrur3mh8P9q8yw5f",
	  	  "10000"
	  	  ]},
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


// Built transaction is returned in JSON and Hex formats    
