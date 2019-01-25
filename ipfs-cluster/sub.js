const ipfsClient = require('ipfs-http-client');
let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5003');
//console.log('ipfs=<',ipfs,'>');

/*
ipfs.swarm.addrs( (err, addrs) =>{
  if (err) {
    throw err
  }
  console.log('ipfs.swarm.addrs addrs=<',addrs,'>');
})
*/


ipfs.id((err, identity) =>{
  if (err) {
    throw err
  }
  console.log('ipfs.swarm.addrs identity=<',identity,'>');
})


const topic = 'fruit-of-the-day';
const receiveMsg = (msg) => {
  console.log('receiveMsg msg.data.toString()=<',msg.data.toString(),'>');
}

ipfs.pubsub.subscribe(topic, receiveMsg, (err) => {
  if (err) {
    throw err
  }
  console.log(`subscribed to ${topic}`)
  console.log('ipfs.pubsub.subscribe topic=<',topic,'>');
})


