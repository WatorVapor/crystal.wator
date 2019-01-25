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



const node = new IPFS(IPFS_CONF);
node.on('ready', () => {
  console.log('ready');
  connectSwarm();
  doShowID();
  doSubscribe();
})

doShowID = () => {
  node.id((err, identity) =>{
    if (err) {
      throw err
    }
    console.log('identity=<',identity,'>');
  })
}

const swarmAddr = multiaddr('/ip6/2400:2412:13e0:9d00:8639:beff:fe67:dcc9/tcp/4006/ipfs/QmRKdj3KvE9myo9JXaC5QRAfjDAKbJxfHx2UBxvLzi9eVy');

connectSwarm = () => {
  /*
  node.swarm.connect(swarmAddr, (err) =>{
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
  })  
}


const topic = 'fruit-of-the-day';
const receiveMsg = (msg) => {
  console.log('receiveMsg msg.data.toString()=<',msg.data.toString(),'>');
}

doSubscribe = () => {
  node.pubsub.subscribe(topic, receiveMsg, (err) => {
    if (err) {
      throw err
    }
    console.log(`subscribed to ${topic}`)
    console.log('ipfs.pubsub.subscribe topic=<',topic,'>');
    node.pubsub.ls((err, topics) => {
      if(err) {
         return console.log('err=<',err,'>');
      }
      console.log('topics=<',topics,'>');
    });

  });  
}
