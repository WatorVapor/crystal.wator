const SHA3  = require('sha3');
const bs58 = require('bs58')

const KnowledgeVerifiedTimeMin = 3;

module.exports = class KnowledgeChain {
  constructor() {
    this.blockTop_ = {};
    this.genisis_();
  }
  
  push(msgKnow) {
    //console.log('push::msgKnow=<',msgKnow,'>');
    let msg = JSON.parse(JSON.stringify(msgKnow))
    let nounce = 'n_' + msg.output.nounce;
    //console.log('push::nounce=<',nounce,'>');
    if(this.blockTop_[nounce]) {
      let block = this.blockTop_[nounce];
      this.addVerifySort_(block.output.ts_verified,msg.output.ts_verified);
      //console.log('push::block=<',block,'>');
      console.log('push::block.output.ts_verified.length=<',block.output.ts_verified.length,'>');
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
  
  addKnowledge_(know) {
    console.log('addKnowledge_::know=<',JSON.stringify(know,null,2),'>');
    //console.log('addKnowledge_::know.input=<',know.input,'>');
    let d = new SHA3.SHA3Hash();
    d.update(JSON.stringify(know));
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
      //this.onKnowBlock(this.topBlockId_);
    }
    return true;
  }
  
  addVerifySort_(verfifyList,verify) {
    console.log('addVerifySort_:verfifyList=<',verfifyList,'>');
    console.log('addVerifySort_:verify=<',verify,'>');
    let ts_to = verify.orig.ts;
    for(let i = 0;i < verfifyList.length;i++) {
      let in=verfifyList[i];
      let ts_in = verfifyList[i].orig.ts;
      console.log('addVerifySort_:ts_in=<',ts_in,'>');
      console.log('addVerifySort_:ts_to=<',ts_to,'>');
      if(ts_to < ts_in) {
        verfifyList.splice(i-1, 0,verify);
        return;
      }
    }
    verfifyList.push(verify);
  }
}

