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

const topic = 'fruit-of-the-day';
const msg = Buffer.from('hello world');

const node = new IPFS(IPFS_CONF);
node.on('ready', () => {
  console.log('ready');
  doShowID();
  publishHello();
})

doShowID = () => {
  node.id((err, identity) =>{
    if (err) {
      throw err
    }
    console.log('identity=<',identity,'>');
  })
}
publishHello = () => {
  node.pubsub.publish(topic,msg,(err) =>{
    if(err) {
      throw err;
    }
  });
}
