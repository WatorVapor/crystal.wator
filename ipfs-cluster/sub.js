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
  /*
  node.id(function (err, identity) {
    if (err) {
      throw err
    }
    console.log('identity=<',identity,'>');
  })
  */
  node.pubsub.subscribe(topic, receiveMsg, (err) => {
    if (err) {
      throw err
    }
    console.log(`subscribed to ${topic}`)
    console.log('ipfs.pubsub.subscribe topic=<',topic,'>');
  })  
})



const topic = 'fruit-of-the-day';
const receiveMsg = (msg) => {
  console.log('receiveMsg msg.data.toString()=<',msg.data.toString(),'>');
}

/*
ipfs.pubsub.subscribe(topic, receiveMsg, (err) => {
  if (err) {
    throw err
  }
  console.log(`subscribed to ${topic}`)
  console.log('ipfs.pubsub.subscribe topic=<',topic,'>');
})
*/


