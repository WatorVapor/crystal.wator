const Room = require('ipfs-pubsub-room');
const WOWAIPFS = require('ipfs');

const WOWA_IPFS_CONF = {
  repo: '.ipfs_pubsub_room_data',
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  }
};


module.exports = class WoWaP2p {
  constructor() {
    this.ipfs = new IPFS(WOWA_IPFS_CONF);
    this.ipfs.on('ready', this.onInit);
  }
  onInit() {
    let self = this;
    this.ipfs.id( (err,identity)=>{
      if (err) {
        throw err
      }
      console.log('identity=<',identity,'>');
      self.peer = identity.id;
    });
  }
};
