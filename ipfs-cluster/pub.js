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

const addr = '/ip6/2400:2412:13e0:9d00:2ce:39ff:fece:132/tcp/4004/ipfs/QmfHFh3DrZc44cbRet5iUuM4Ci5YtKePxZp5jwmDCVYqDr'

ipfs.swarm.connect(addr, (err) =>{
  if (err) {
    throw err
  }
})

const topic = 'fruit-of-the-day';

ipfs.pubsub.publish(topic, '{good}', (err) => {
  if (err) {
    throw err
  }
})


