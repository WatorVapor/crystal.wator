const IPFS = require('ipfs');
const multiaddr = require('multiaddr');
const IPFS_CONF = {
  repo: '.ipfs_pubsub_room_data',
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/ip6/::/tcp/4006'
      ]
    }
  }
};

const topic = 'fruit-of-the-day';
const msg = Buffer.from('hello world');

const node = new IPFS(IPFS_CONF);
node.on('ready', () => {
  console.log('ready node=<',node,'>');
  console.log('ready node_peerInfo.id.toB58String()=<',node._peerInfo.id.toB58String(),'>');
  
  connectSwarm();
  doShowID();
})
node.on('error', (error) => {
  console.log('error=<',error,'>');
})
node.on('start', () => {
  console.log('Node started!')
});

const swarmAddr = multiaddr('/ip6/2400:2412:13e0:9d00:2ce:39ff:fece:132/tcp/4006/ipfs/QmcdUnSFqTE9rYC2w623heJyWFKNtsbDemhpv7MPCFvbLa');
console.log('swarmAddr=<',swarmAddr,'>');

connectSwarm = () => {
  /*
  node.swarm.connect(swarmAddr, (err) => {
    if (err) {
      return console.log('err=<',err,'>');
    }
  })
  */
  node.bootstrap.add(swarmAddr,(err, res) => {
    if (err) {
      return console.log('err=<',err,'>');
    }
    console.log('res=<',res,'>');
    publishHello();
  })
  
  /*
  node.swarm.peers((err, peerInfos) => {
    if (err) {
      return console.log('err=<',err,'>');
    }
    console.log('peerInfos=<',peerInfos,'>');
  })
  */
}

doShowID = () => {
  node.id((err, identity) =>{
    if (err) {
       return console.log('err=<',err,'>');
    }
    console.log('identity=<',identity,'>');
  })
}
publishHello = () => {
  node.pubsub.ls((err, topics) => {
    if(err) {
       return console.log('err=<',err,'>');
    }
    console.log('topics=<',topics,'>');
  });
  node.pubsub.publish(topic,msg,(err) =>{
    if(err) {
       return console.log('err=<',err,'>');
    }
  });
}
