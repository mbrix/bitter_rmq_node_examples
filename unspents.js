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
        	var x = JSON.parse(msg.content.toString());
        	console.log(' [.] Got %s', JSON.stringify(x, null, 2));
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


// Unspents are returned as an array
/*
{
  "result": {
    "unspents": [
      {
        "vout": 1,
        "txid": "b8c3f50a6ddd19d5e2957f77e1200c3ed7ed6b7f6d765023e6e76b371afe3dff",
        "scriptPubKey": "76a91460867a7376815dd0365528bf5a13e09e290abe3f88ac",
        "quantity": 0,
        "height": 194092,
        "confirmations": 1565,
        "color": "uncolored",
        "amount": 0.00008,
        "address": "19oNy8k6bDpvB2fj3qzPQQhaDGXL1mAFrG"
      },
      {
        "vout": 22,
        "txid": "f518e2aca8a1ff660e49d5b724a31a68dab6e381ea07745e7f195ab906073bfe",
        "scriptPubKey": "76a914e8b142e793721fd5db7b04adb1c274c6829f018888ac",
        "quantity": 0,
        "height": 194092,
        "confirmations": 13162,
        "color": "uncolored",
        "amount": 0.0001,
        "address": "1NDN7qf4rjwvTaNA7A9MhqNP4ZYuSLEpaH"
      },
      {
        "vout": 1,
        "txid": "f820b2d758ae671f3f29328b044c0b70cbdb398e44de4ea9377d5e78c9a49efc",
        "scriptPubKey": "76a91421e8957566f666977283fc2b7651a08e0217bdeb88ac",
        "quantity": 0,
        "height": 194092,
        "confirmations": 12668,
        "color": "uncolored",
        "amount": 2,
        "address": "146HvYBrhDvLmjqT1An4N8bPo3UXkytCrh"
      },
      {
        "vout": 40,
        "txid": "97a9ce04bb12dc207720e48261856c0566e7a2fedf107a3fcf0c23d85ed35efc",
        "scriptPubKey": "76a9145ecb30c7c06164257f02062cb09f6d3b57b829f988ac",
        "quantity": 0,
        "height": 194092,
        "confirmations": 17252,
        "color": "uncolored",
        "amount": 0.0005,
        "address": "19eDvxcXQf9to9RY7faZLVUEtxVGJz1uqC"
      },
 ],
    "height": 194092
  },
  "id": "0.54038872616365550.52458932762965560.8359060653019696",
  "error": null
}
*/      
