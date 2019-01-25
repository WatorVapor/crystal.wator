const IPFS = require('ipfs');
const IPFS_CONF = {
  repo: '.ipfs_pubsub_room_data',
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/ip4/0.0.0.0/tcp/4004',
        '/ip6/::/tcp/4004',
        '/ip4/127.0.0.1/tcp/4005/ws'
      ]
    }
  }
};


const node = new IPFS(IPFS_CONF);
node.on('ready', () => {
  console.log('ready');
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
