const SHA3  = require('sha3');
const Miner  = require('./mine.js');

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
  constructor() {
    this.Bills_ = [];
    this.prevBlock_ = '';
    this.difficulty_ = blockDifficulty;
    this.version_ = 1.0;
    this.size_ = 0;
    this.miner_ = new Miner();
    this.sign =[];
  }
  
  addBill(bill) {
    //console.log('typeof bill=<',typeof bill,'>');    
    if(typeof bill === 'object') {
      this.Bills_.push(bill);
    }
    //console.log('this.Bills_=<',this.Bills_,'>');
    let blockBinary = JSON.stringify(this);
    this.size_ += blockBinary.length;
    //console.log('this.size_=<',this.size_,'>');
    if(this.size_ > BlockSize) {
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

let blockGenesis = new Block();
let firstBill = new Bill('Oracle','Google',0,'Oracle had sought $9 billion',);
blockGenesis.addBill(firstBill);

let zeroBill = new Bill('000000000000000','000000000000000',0,'000000000000000',);

for(let i = 0;i < 100000;i++) {
  let fullBlock = blockGenesis.addBill(zeroBill);
  if(fullBlock){
    blockGenesis.pushToChain();
    break;
  };
}
console.log('blockGenesis=<',blockGenesis,'>');

