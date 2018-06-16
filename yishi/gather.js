const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5003');
//const ipfs = ipfsAPI('localhost', '5003', {protocol: 'http'})
//const ipfs = ipfsAPI('ipfs.wator.xyz', '443', {protocol: 'https'})
//console.log('ipfs=<',ipfs,'>');

ipfs.id( (err, identity) => {
  if (err) {
    throw err;
    process.exit();
  }
  //console.log('identity=<',identity,'>');
});

const ipfsSubTopic = 'wai-ipfs-yishi-created';

const onRcvIpfsMsg = (msg) => {
  //console.log('onRcvIpfsMsg msg.data.toString()=<',msg.data.toString('utf8'),'>');
  //console.trace();
  let msgJson = JSON.parse(msg.data.toString('utf8'));
  //console.log('onRcvIpfsMsg msgJson=<',msgJson,'>');
  stampNewKnowledge(msgJson);
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

const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');

function stampNewKnowledge(msgJson) {
  //console.log('stampNewKnowledge msgJson=<',msgJson,'>');
  let ts = myWoWa.createTimeStamp(msgJson.output.knowHash);
  msgJson.output.ts_verified = ts;
  console.log('stampNewKnowledge msgJson=<',JSON.stringify(msgJson,null,' '),'>');
}
