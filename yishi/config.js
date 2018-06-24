const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5003');

/*
ipfs.config.get((err, config) => {
  if (err) {
    throw err
  }
  console.log(config)
});

ipfs.swarm.addrs(function (err, addrs) {
  if (err) {
    throw err
  }
  console.log(addrs)
});
*/

ipfs.id(function (err, identity) {
  if (err) {
    throw err
  }
  console.log(identity)
  ipfs.swarm.peers({verbose:true},function (err, peerInfos) {
    if (err) {
      throw err
    }
    console.log(peerInfos)
  })
})



/*
ipfs.swarm.connect('QmW8rAgaaA6sRydK1k6vonShQME47aDxaFidbtMevWs73t', function (err) {
  if (err) {
    throw err
  }
  // if no err is present, connection is now open
})
*/


