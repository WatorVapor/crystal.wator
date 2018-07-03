const WoWaP2P  = require('./wo_wa_p2p.js');
const CHANNEL  = require('./channel.js');
let p2p = new WoWaP2P();
p2p.onReady = () => {
  p2p.in(CHANNEL.KNOWLEDGE.CREATE,onKnowledgeCreate);
};

onKnowledgeCreate = (msg)=>{
  console.log('onKnowledgeCreate::msg=<',msg,'>');
  stampNewKnowledge(msg);
};


const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');

function stampNewKnowledge(msgJson) {
  //console.log('stampNewKnowledge msgJson=<',msgJson,'>');
  let ts = myWoWa.createTimeStamp(msgJson.output.nounce);
  msgJson.output.ts_verified = ts;
  console.log('stampNewKnowledge msgJson=<',msgJson,'>');
  console.log('stampNewKnowledge msgJson=<',JSON.stringify(msgJson,null,' '),'>');
  //broadCastKnowlegeVerified(JSON.stringify(msgJson));
}

/*
function broadCastKnowlegeVerified(knowVerified) {
  const msgBuff = Buffer.from(knowVerified);
  ipfs.pubsub.publish(ipfsPubTopicVerified, msgBuff, (err) => {
    if (err) {
      throw err;
    }
    console.log('sented msgBuff=<',msgBuff,'>');
  });
}
*/

