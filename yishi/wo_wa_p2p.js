const Room = require('ipfs-pubsub-room');
const IPFS = require('ipfs');

const IPFS_CONF = {
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

const SHA3  = require('sha3');
const bs58 = require('bs58')

module.exports = class WoWaP2p {
  constructor() {
    let d = new SHA3.SHA3Hash();
    d.update('!!欢迎来到WoWa!!');
    let number = d.digest('hex');
    this.number = bs58.encode(number);
    console.log('this.number=<',this.number,'>');
    this.ipfs = new IPFS(IPFS_CONF);
    let self = this;
    this.ipfs.on('ready', () => {
      self.onInit();
    });
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
