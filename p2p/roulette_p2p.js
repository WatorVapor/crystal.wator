const Room = require('ipfs-pubsub-room');
const IPFS = require('ipfs');
const SHA3  = require('sha3');
const bs58 = require('bs58')
const execSync = require('child_process').execSync;



const REPO_PREFIX = '.ipfs_pubsub_room_data/';
const IPFS_CONF = {
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


module.exports = class RouletteP2P {
  constructor(wold_msg) {
    let nowTag = new Date();
    let dNowTag = new SHA3.SHA3Hash(224);
    dNowTag.update(nowTag.toISOString() + nowTag.getMilliseconds().toString());
    let buffNowTag = Buffer.from(dNowTag.digest('hex'),'hex');
    const pubsubRepos = bs58.encode(buffNowTag);
    console.log('pubsubRepos=<',pubsubRepos,'>');
    execSync('mkdir -p ' + REPO_PREFIX);
    IPFS_CONF.repo = REPO_PREFIX + pubsubRepos;
    let d = new SHA3.SHA3Hash(224);
    d.update(wold_msg);
    let number = Buffer.from(d.digest('hex'),'hex');
    this.number = bs58.encode(number);
    //console.log('this.number=<',this.number,'>');
    this.ipfs = new IPFS(IPFS_CONF);
    let self = this;
    this.ipfs.on('ready', () => {
      self._onInit();
    });
    this._cb = false;
  }
  publish(msgObj) {
    this.room.broadcast(JSON.stringify(msgObj));
  }
  subscribe(cb) {
    this._cb = cb;
  }
  
  
  // internal
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
      if(typeof self.onJoint === 'function') {
        self.onJoint(peer);
      }
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
      //console.log('onRoomMessage::jsonData=<',jsonData,'>');
      if(jsonData) {
        if(typeof(this._cb) === 'function') {
          this._cb(jsonData,msg.from);
        } else {
          //console.log('onRoomMessage::jsonData=<',jsonData,'>');
        }
      }
    } else {
      //console.log('onRoomMessage::ignore loopback msg !!!!!!!!!!!!!!');
    }
  }
};
