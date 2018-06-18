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

const ipfsSubTopicCreated = 'wai-ipfs-yishi-created';
const ipfsPubTopicVerified = 'wai-ipfs-yishi-verified';

const onRcvIpfsMsg = (msg) => {
  //console.log('onRcvIpfsMsg msg.data.toString()=<',msg.data.toString('utf8'),'>');
  //console.trace();
  let msgJson = JSON.parse(msg.data.toString('utf8'));
  //console.log('onRcvIpfsMsg msgJson=<',msgJson,'>');
  stampNewKnowledge(msgJson);
}
ipfs.pubsub.subscribe(ipfsSubTopicCreated, onRcvIpfsMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe ipfsSubTopicCreated=<',ipfsSubTopicCreated,'>');
});

ipfs.pubsub.peers(ipfsSubTopicCreated, (err, peerIds) => {
  if (err) {
    return console.error(`failed to get peers subscribed to ${ipfsSubTopicCreated}`, err)
  }
  console.log(peerIds)
})

const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');

function stampNewKnowledge(msgJson) {
  //console.log('stampNewKnowledge msgJson=<',msgJson,'>');
  let ts = myWoWa.createTimeStamp(msgJson.output.nounce);
  msgJson.output.ts_verified = ts;
  console.log('stampNewKnowledge msgJson=<',msgJson,'>');
  console.log('stampNewKnowledge msgJson=<',JSON.stringify(msgJson,null,' '),'>');
  broadCastKnowlegeVerified(JSON.stringify(msgJson));
}

function broadCastKnowlegeVerified(knowVerified) {
  const msgBuff = Buffer.from(knowVerified);
  ipfs.pubsub.publish(ipfsPubTopicVerified, msgBuff, (err) => {
    if (err) {
      throw err;
    }
    console.log('sented msgBuff=<',msgBuff,'>');
  });
}

