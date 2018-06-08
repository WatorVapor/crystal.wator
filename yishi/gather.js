const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');
//const ipfs = ipfsAPI('localhost', '5002', {protocol: 'http'})
//const ipfs = ipfsAPI('ipfs.wator.xyz', '443', {protocol: 'https'})
//console.log('ipfs=<',ipfs,'>');

ipfs.id( (err, identity) => {
  if (err) {
    throw err;
    process.exit();
  }
  //console.log('identity=<',identity,'>');
});

const ipfsSubTopic = 'wai-ipfs-yisshi-created';

const onRcvIpfsMsg = (msg) => {
  console.log('onRcvIpfsMsg msg=<',msg,'>');
  //console.trace();
  pubRedis.publish(redisPubChannel,msg.data.toString('utf8'));
}
ipfs.pubsub.subscribe(ipfsSubTopic, onRcvIpfsMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe ipfsSubTopic=<',ipfsSubTopic,'>');
});

ipfs.pubsub.peers(ipfsSubTopic, (err, peerIds) => {
  if (err) {
    return console.error(`failed to get peers subscribed to ${ipfsSubTopic}`, err)
  }
  console.log(peerIds)
})
