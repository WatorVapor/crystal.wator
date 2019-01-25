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

const topic = 'fruit-of-the-day';
const msg = Buffer.from('hello world');

const node = new IPFS(IPFS_CONF);
node.on('ready', () => {
  console.log('ready');
  doShowID();
  publishHello();
})

const swarmList = '/ip6/2400:2412:13e0:9d00:2ce:39ff:fece:132/tcp/4006/ipfs/QmcdUnSFqTE9rYC2w623heJyWFKNtsbDemhpv7MPCFvbLa';


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
