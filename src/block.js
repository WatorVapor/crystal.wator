const SHA3  = require('sha3');
const Miner  = require('./mine.js');
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');


// WC => 1000 mWc
// mWC => 1000 uWc

// unit uWC
const transactionFee = 100;


class Bill {
  constructor(dst,src,input,msg,original) {
    this.fee_ = transactionFee;
    this.dst_ = dst;
    this.src_ = src;
    this.input_ = input;
    this.ouput_ = this.input_ - transactionFee;
    this.original_ = original;
    this.msg_ = msg;
    this.sign =[];
  }
}


const BlockSize = 1000*1000*1000;
const blockDifficulty = 1000;

class Block {
  constructor(msg) {
    this.transactions = [];
    this.prev = '';
    this.block = '';
    this.difficulty = blockDifficulty;
    this.version = 1.0;
    this.size = 0;
    this.sign =[];
    this.msg = msg;
    this.nounce= '';
    this.timestamp = new Date();
  }
  
  addTransaction(transactions) {
    //console.log('typeof transactions=<',typeof transactions,'>');    
    if(typeof transactions === 'object') {
      this.transactions.push(transactions);
    }
    //console.log('this.transactions=<',this.transactions,'>');
    let blockBinary = JSON.stringify(this);
    this.size += blockBinary.length;
    //console.log('this.size_=<',this.size_,'>');
    if(this.size > BlockSize) {
      return true;
    } else {
      return false;
    }
  }
  pushToChain() {
    let billBinary = JSON.stringify(this.Bills_);
    let d = new SHA3.SHA3Hash();
    d.update(billBinary);
    let sum = d.digest('hex');
    //console.log('sum=<',sum,'>');
    this.billSum_ = sum;
    this.ver = 1.0;
    let pow = this.miner_.run(this.billSum_);
    this.powNounce_  = pow.nounce;
    this.powSum_  = pow.sum;
  }
}


ipfs.id( (err, identity) => {
  if (err) {
    throw err;
    process.exit();
  }
  console.log('identity=<',identity,'>');
  setTimeout(createGenesisBlockA,0)
});

function createGenesisBlockA(){
  const genesisMsg = '美中贸易战 “川普捡了芝麻 丢了西瓜”';
  let blockGenesisA = new Block(genesisMsg);
  //console.log('blockGenesisA=<',blockGenesisA,'>');
  let miner = new Miner();
  let winner = miner.run(genesisMsg);
  //console.log('winner=<',winner,'>');
  blockGenesisA.block = winner.sum;
  blockGenesisA.nounce = winner.nounce;
  //console.log('blockGenesisA=<',blockGenesisA,'>');
  let blockGenesisAStr = JSON.stringify(blockGenesisA);
  console.log('blockGenesisAStr=<',blockGenesisAStr,'>');
  
  const msgBuff = Buffer.from(blockGenesisAStr);
  ipfs.add(msgBuff, function (err, files) {
    if(err) {
      throw err;
    }
    console.log('createGenesisBlockA files=<',files,'>');
  });
}
