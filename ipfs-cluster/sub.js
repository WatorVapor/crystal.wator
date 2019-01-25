const IPFS = require('ipfs');
const IPFS_CONF = {
  repo: '.ipfs_pubsub_room_data',
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/ip4/0.0.0.0/tcp/4006',
        '/ip6/::/tcp/4006',
        '/ip4/127.0.0.1/tcp/4007/ws'
      ]
    }
  }
};

const swarmList = '/ip6/2400:2412:13e0:9d00:8639:beff:fe67:dcc9/tcp/4006/ipfs/QmRKdj3KvE9myo9JXaC5QRAfjDAKbJxfHx2UBxvLzi9eVy';


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

connectSwarm = () => {
  node.swarm.connect(swarmAddr, (err) =>{
    if (err) {
      return console.log('err=<',err,'>');
    }
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
  })  
}
