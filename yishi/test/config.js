const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5003');
const ipfs2 = ipfsAPI('/ip4/127.0.0.1/tcp/5004');

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

ipfs2.id(function (err, identity) {
  if (err) {
    throw err
  }
  console.log(identity)
}

/*
ipfs.swarm.connect('/ip4/192.168.0.160/tcp/4005/ws/ipfs/QmXhwvxw3TQTEKfu6GxuCBq6TWYC5rgoxn8bA6hZC6r79d', function (err) {
  if (err) {
    throw err
  }
  // if no err is present, connection is now open
  console.log('QmXhwvxw3TQTEKfu6GxuCBq6TWYC5rgoxn8bA6hZC6r79d connected!!!!');
})

ipfs.swarm.connect('/ip4/192.168.0.10/tcp/4005/ws/ipfs/QmTN5KCezPN5aUM21ktfx5kpaidtudNTn8dGvgaviMj3iD', function (err) {
  if (err) {
    throw err
  }
  // if no err is present, connection is now open
  console.log('QmTN5KCezPN5aUM21ktfx5kpaidtudNTn8dGvgaviMj3iD connected!!!!');
})

ipfs.swarm.connect('/ip4/192.168.0.10/tcp/4003/ws/ipfs/QmanPdBk6pR1v8C2LwWtKAA2diQgyEHs7bFyghLbJsHDzj', function (err) {
  if (err) {
    throw err
  }
  // if no err is present, connection is now open
  console.log('QmanPdBk6pR1v8C2LwWtKAA2diQgyEHs7bFyghLbJsHDzj connected!!!!');
})
*/
