const SHA3  = require('sha3');
const bs58 = require('bs58')
module.exports = class KnowledgeChain {
  constructor() {
    this.blockList_ = {};
  }
  push(msg) {
    console.log('push::msg=<',msg,'>');
    let nounce = msg.output.nounce;
    console.log('push::nounce=<',nounce,'>');
    if(this.blockList_[nounce]) {
      let block = this.blockList_[nounce];
      block.output.ts_verified.push(msg.output.ts_verified);
      console.log('push::block=<',block,'>');
    } else {
      let ts_verified = msg.output.ts_verified;
      delete msg.output.ts_verified;
      msg.output.ts_verified = [];
      msg.output.ts_verified.push(ts_verified);
      this.blockList_[nounce] = msg;
    }
  }
}

