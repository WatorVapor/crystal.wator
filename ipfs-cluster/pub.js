const IPFS = require('ipfs');
const IPFS_CONF = {
  repo: '.ipfs_pubsub_room_data',
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
      ]
    }
  }
};


const node = new IPFS(IPFS_CONF);
node.on('ready', () => {
  console.log('ready');
  node.id(function (err, identity) {
    if (err) {
      throw err
    }
    console.log('identity=<',identity,'>');
  })
})

