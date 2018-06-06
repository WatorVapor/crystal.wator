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
  constructor(msg,prev) {
    this.ts = [];
    if(prev) {
      this.p = prev;
    } else {
      this.p = '';
    }
    this.b = '';
    this.d = blockDifficulty;
    this.v = 1.0;
    this.sz = 0;
    this.sign =[];
    this.msg = msg;
    this.n= '';
    let now = new Date();
    this.tp = now.toUTCString();
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
  const genesisMsg = ':美中贸易战 “川普捡了芝麻 丢了西瓜”';
  let blockGenesisA = new Block(genesisMsg);
  //console.log('blockGenesisA=<',blockGenesisA,'>');
  let miner = new Miner();
  let winner = miner.run(genesisMsg);
  //console.log('winner=<',winner,'>');
  blockGenesisA.b = winner.sum;
  blockGenesisA.n = winner.nounce;
  blockGenesisA.tp = 'Wed, 06 Jun 2018 01:28:14 GMT';
  //console.log('blockGenesisA=<',blockGenesisA,'>');
  let blockGenesisAStr = JSON.stringify(blockGenesisA);
  console.log('blockGenesisAStr=<',blockGenesisAStr,'>');
  
  const msgBuff = Buffer.from(blockGenesisAStr);
  ipfs.add(msgBuff, function (err, files) {
    if(err) {
      throw err;
    }
    //console.log('createGenesisBlockA files=<',files,'>');
    if(files.length > 0) {
      createGenesisBlockB(files[0].path,blockGenesisA.b);
    }
  });
}

function createGenesisBlockB(prevBlock,prev){
  console.log('createGenesisBlockB prevBlock=<',prevBlock,'>');
  const genesisMsg = prevBlock+':大型恐竜、卵温めた？';
  let blockGenesisB = new Block(genesisMsg,prev);
  //console.log('blockGenesisB=<',blockGenesisB,'>');
  let miner = new Miner();
  let winner = miner.run(genesisMsg);
  //console.log('winner=<',winner,'>');
  blockGenesisB.b = winner.sum;
  blockGenesisB.n = winner.nounce;
  blockGenesisB.tp = 'Wed, 06 Jun 2018 01:28:15 GMT';
  //console.log('blockGenesisB=<',blockGenesisB,'>');
  let blockGenesisBStr = JSON.stringify(blockGenesisB);
  console.log('blockGenesisBStr=<',blockGenesisBStr,'>');
}
