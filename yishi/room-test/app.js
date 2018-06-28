const Room = require('ipfs-pubsub-room')
const IPFS = require('ipfs')
const ipfs = new IPFS({
  repo: './ipfs_pubsub_room_data',
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
});

let minePeerID = false;
// IPFS node is ready, so we can start using ipfs-pubsub-room
ipfs.on('ready', () => {
  ipfs.id( (err,identity)=>{
    if (err) {
      throw err
    }
    console.log('identity=<',identity,'>');
    minePeerID = identity.id;
  });
  const room = Room(ipfs, 'wai-QmPDsajgBiyJyoCPFGkVrs8zwKdnsDnb5KcZcJ7SUfNZbM');
  room.on('peer joined', (peer) => {
    console.log('Peer joined the room', peer);
    setTimeout(()=>{
      room.broadcast('hello');
    },1000);
  });
  room.on('peer left', (peer) => {
    console.log('Peer left...', peer);
  });
  // now started to listen to room
  room.on('subscribed', () => {
    console.log('Now connected!');
  });
  room.on('message', onRoomMessage);
});


const onRoomMessage = (msg) =>{
  console.log('onRoomMessage::minePeerID=<',minePeerID,'>');
  if(msg.from !== minePeerID) {
    console.log('onRoomMessage::msg=<',msg,'>');
  } else {
    console.log('onRoomMessage::ignore loopback msg !!!!!!!!!!!!!!');
  }
}
