#!/usr/bin/env node

var amqp = require('amqplib/callback_api');


// Subscribe to updates to response_queue
// which is associated with a utxo set by connect_utxo rpc


// Matching confirmed TX Response

/*
{
  "type": "confirmed",
  "vout": [
    {
      "vout": 1,
      "value": 0.49745533,
      "scriptPubKey": {
        "hex": "76a914bfbb4fecc8d859f6e9af32f3d89312f6a4c9a75388ac",
        "asm": ""
      },
      "quantity": 0,
      "color": "uncolored"
    },
    {
      "vout": 0,
      "value": 0.00204467,
      "scriptPubKey": {
        "hex": "76a91493f9955071d20bc73a1453a5fe4ee9f9a01278e188ac",
        "asm": ""
      },
      "quantity": 0,
      "color": "uncolored"
    }
  ],
  "vin": [
    {
      "vout": 1,
      "txid": "ece916d2e6a42536613a40ce659e3cfe629ff7ccbb9046daa8b89f5de6501102",
      "sequence": 4294967295,
      "scriptsig": {
        "hex": "4830450220052c511cbc249d76a2ca7598ae9af4a5c9524e316ce9d5d56fceb04d96436527022100f1354cd1291a7bf043ef63cc2abff4f7d33c5b96a2f6b8a24a168f5e74c4ce740141048cc0b94178715f03ed3d0bceb368191d0fdd7fc16d806567f6f2c45aecafb8f53e5ef849564072189b9b4f8bfe1564da776567ba359cfb0c05e839bcf65371ab",
        "asm": ""
      }
    }
  ],
  "version": 1,
  "txid": "12ba0c3b2d807e096a1a0c870ede49ad7ac610b11eafb050dc1bfb7059c3699d",
  "locktime": 0,
  "hex": "0100000001021150e65d9fb8a8da4690bbccf79f62fe3c9e65ce403a613625a4e6d216e9ec010000008b4830450220052c511cbc249d76a2ca7598ae9af4a5c9524e316ce9d5d56fceb04d96436527022100f1354cd1291a7bf043ef63cc2abff4f7d33c5b96a2f6b8a24a168f5e74c4ce740141048cc0b94178715f03ed3d0bceb368191d0fdd7fc16d806567f6f2c45aecafb8f53e5ef849564072189b9b4f8bfe1564da776567ba359cfb0c05e839bcf65371abffffffff02b31e0300000000001976a91493f9955071d20bc73a1453a5fe4ee9f9a01278e188ac7d0ef702000000001976a914bfbb4fecc8d859f6e9af32f3d89312f6a4c9a75388ac00000000"
}
*/

// Unconfirmed is same as above with unconfirmed type.

// Block height message

/*
{
  "type": "block_height",
  "height": 240241,
  "hash": "0000000000000006f77657b75bc9704dbd9f3ab9ee4a0103df129357d11b0bfa"
}
*/

// confirmed rewind  type = "rewind"

// doublespend   type = "doublespend"

// ejection type = "ejection"
// shared_output = [Hash, Index]

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
      
   ch.consume('response_queue', function(msg) {
        	var x = JSON.parse(msg.content.toString());
        	console.log(' [.] Got %s', JSON.stringify(x, null, 2));
   }, {noAck: true});


   });
});
