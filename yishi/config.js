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
  /*
  ipfs.swarm.peers({verbose:true},function (err, peerInfos) {
    if (err) {
      throw err
    }
    console.log(peerInfos)
  })
  */
})



/*
ipfs.swarm.connect('/ip4/192.168.0.10/tcp/4004/ipfs/QmYZ4TG6YBgD3rEKMhQ9p4Bjhw14xbC6hXac3YY6ovR2Qu', function (err) {
  if (err) {
    throw err
  }
  // if no err is present, connection is now open
})
*/

ipfs.swarm.connect('/ip4/192.168.0.7/tcp/4005/ws/ipfs/QmW8rAgaaA6sRydK1k6vonShQME47aDxaFidbtMevWs73t', function (err) {
  if (err) {
    throw err
  }
  // if no err is present, connection is now open
})



