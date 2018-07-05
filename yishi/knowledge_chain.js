const SHA3  = require('sha3');
const bs58 = require('bs58')

const KnowledgeVerifiedTimeMin = 2;

module.exports = class KnowledgeChain {
  constructor() {
    this.blockTop_ = {};
    this.genisis_();
  }
  push(msgBlk) {
    //console.log('push::msgBlk=<',msgBlk,'>');
    let msg = JSON.parse(JSON.stringify(msgBlk))
    let nounce = 'n_' + msg.output.nounce;
    //console.log('push::nounce=<',nounce,'>');
    if(this.blockTop_[nounce]) {
      let block = this.blockTop_[nounce];
      block.output.ts_verified.push(msg.output.ts_verified);
      //console.log('push::block=<',block,'>');
      if(block.output.ts_verified.length >= KnowledgeVerifiedTimeMin) {
        if(this.addKnowledge_(block)) {
          delete this.blockTop_[nounce];
        }
      }
    } else {
      let ts_verified = JSON.parse(JSON.stringify(msg.output.ts_verified));
      delete msg.output.ts_verified;
      msg.output.ts_verified = [];
      msg.output.ts_verified.push(ts_verified);
      this.blockTop_[nounce] = msg;
    }
    //console.log('this.blockList_=<',JSON.stringify(this.blockList_),'>');
  }
  
  genisis_() {
    let blockChain = {};
    blockChain.prev = '';
    blockChain.matter =  '物质是一个科学上没有明确定义的词，一般是指静止质量不为零的东西。物质也常用来泛称所有组成可观测物体的成分';
    let d = new SHA3.SHA3Hash();
    d.update(JSON.stringify(blockChain.matter));
    let blockHash = d.digest('hex');
    console.log('blockHash=<',blockHash,'>');

    let d2 = new SHA3.SHA3Hash();
    d2.update(blockHash + blockChain.prev);
    let blockId = d2.digest('hex');
    console.log('blockId=<',blockId,'>');
    
    this.topBlockId_ = blockId;   
  }
  
  addKnowledge_(block) {
    //console.log('addKnowledge_::block=<',JSON.stringify(block,null,2),'>');
    let d = new SHA3.SHA3Hash();
    d.update(JSON.stringify(block));
    let blockHash = d.digest('hex');
    //console.log('blockHash=<',blockHash,'>');
    let blockChain = {};
    blockChain.prev = this.topBlockId_;
    let d2 = new SHA3.SHA3Hash();
    d2.update(blockHash + blockChain.prev);
    let blockId = d2.digest('hex');
    //console.log('blockId=<',blockId,'>');

    this.topBlockId_ = blockId;   
    
    if(typeof this.onKnowBlock === 'function') {
      this.onKnowBlock(this.topBlockId_);
    }
    return true;
  }
}

