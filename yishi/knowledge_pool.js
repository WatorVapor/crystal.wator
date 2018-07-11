const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');

const WoWaP2P  = require('./wo_wa_p2p.js');
const CHANNEL  = require('./channel.js');
let p2p = new WoWaP2P();
p2p.onReady = () => {
  p2p.in(CHANNEL.KNOWLEDGE.CREATE,onKnowledgeCreate);
  p2p.in(CHANNEL.KNOWLEDGE.VERIFY,onKnowledgeVerify);
};

const KnowledgeChain  = require('./knowledge_chain.js');
let chain = new KnowledgeChain();


onKnowledgeCreate = (msg,from)=>{
  //console.log('onKnowledgeCreate::from=<',from,'>');
  //console.log('onKnowledgeCreate::msg=<',msg,'>');
  if(myWoWa.verifyKnowledge(msg.output.nounce,msg.output.ts_created,true)) {
    let ts = myWoWa.createTimeStamp(msg.output.nounce);
    msg.output.ts_verified = ts;
    //console.log('onKnowledgeCreate::msg=<',msg,'>');
    p2p.out(CHANNEL.KNOWLEDGE.VERIFY,msg);
    chain.push(msg);
  }
};

chain.onKnowBlock = (block) => {
  console.log('chain.onKnowBlock::block=<',block,'>');
}

onKnowledgeVerify = (msg)=>{
  //console.log('onKnowledgeVerify::msg=<',msg,'>');
  let goodCreated = myWoWa.verifyKnowledge(msg.output.nounce,msg.output.ts_created);
  let goodVerified = myWoWa.verifyKnowledge(msg.output.nounce,msg.output.ts_created,true);
  console.log('onKnowledgeVerify::goodCreated=<',goodCreated,'>');
  console.log('onKnowledgeVerify::goodVerified=<',goodVerified,'>');
  if(goodCreated && goodVerified) {
    chain.push(msg);
  }
};
