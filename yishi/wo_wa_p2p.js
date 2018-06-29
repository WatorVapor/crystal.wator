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
    let d = new SHA3.SHA3Hash(224);
    d.update('!!欢迎来到WoWa!!');
    let number = d.digest('hex');
    this.number = bs58.encode(number);
    console.log('this.number=<',this.number,'>');
    this.ipfs = new IPFS(IPFS_CONF);
    let self = this;
    this.ipfs.on('ready', () => {
      self._onInit();
    });
    this._cb = {};
  }
  out(channel,msgObj) {
    msgObj.channel = channel;
    this.room.broadcast(JSON.stringify(msgObj));
  }
  in(channel,cb) {
    this._cb[channel] = cb;
  }
  
  _onInit() {
    let self = this;
    this.ipfs.id( (err,identity)=>{
      if (err) {
        throw err
      }
      console.log('identity=<',identity,'>');
      self.peer = identity.id;
    });
    this.room = Room(this.ipfs, 'wai-' + this.number);
    this.room.on('peer joined', (peer) => {
      console.log('Peer joined the room', peer);
    });
    this.room.on('peer left', (peer) => {
      console.log('Peer left...', peer);
    });
    // now started to listen to room
    this.room.on('subscribed', () => {
      console.log('Now connected!');
      if(typeof self.onReady === 'function') {
        self.onReady();
      }
    });
    this.room.on('message', (msg)=>{
      self._onRoomMessage(msg);
    });
  }
  _onRoomMessage(msg) {
    //console.log('onRoomMessage::this.peer=<',this.peer,'>');
    if(msg.from !== this.peer) {
      //console.log('onRoomMessage::msg=<',msg,'>');
      let jsonData = JSON.parse(msg.data.toString('utf8'));
      console.log('onRoomMessage::jsonData=<',jsonData,'>');
    } else {
      console.log('onRoomMessage::ignore loopback msg !!!!!!!!!!!!!!');
    }
  }
};
