const SHA3  = require('sha3');
const bs58 = require('bs58')

const KnowledgeVerifiedTimeMin = 2;

module.exports = class KnowledgeChain {
  constructor() {
    this.blockList_ = {};
  }
  push(msgBlk) {
    //console.log('push::msgBlk=<',msgBlk,'>');
    let msg = JSON.parse(JSON.stringify(msgBlk))
    let nounce = 'n_' + msg.output.nounce;
    //console.log('push::nounce=<',nounce,'>');
    if(this.blockList_[nounce]) {
      let block = this.blockList_[nounce];
      block.output.ts_verified.push(msg.output.ts_verified);
      //console.log('push::block=<',block,'>');
      if(block.output.ts_verified.length >= KnowledgeVerifiedTimeMin) {
        if(this.addKnowledge_(block)) {
          delete this.blockList_[nounce];
        }
      }
    } else {
      let ts_verified = JSON.parse(JSON.stringify(msg.output.ts_verified));
      delete msg.output.ts_verified;
      msg.output.ts_verified = [];
      msg.output.ts_verified.push(ts_verified);
      this.blockList_[nounce] = msg;
    }
    //console.log('this.blockList_=<',JSON.stringify(this.blockList_),'>');
  }
  
  addKnowledge_(block) {
    console.log('addKnowledge_::block=<',JSON.stringify(block,null,2),'>');
    if(typeof this.onKnowBlock === 'function') {
      this.onKnowBlock();
    }
  }
}

