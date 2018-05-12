const SHA3  = require('sha3');
const fs = require('fs');
const crypto = require('crypto');

const EC = require('elliptic').ec;
const ec = new EC('p521');
//console.log('ec=<',ec,'>');
const bs58 = require('bs58')



module.exports = class Wallet {
  
  constructor(path) {
    if(path) {
      this.path_ = path;
    } else {
      this.path_ = 'wallet.dat';
    }
    if(!isExistFile(this.path_)) {
      this.hexKeys = {};
      this.createECDSA_();
      this.saveWallet_();
    }
    this.rawKeys = {};
    this.loadWallet_();
    //console.log('this=<',this,'>');
  }
  
  save() {
    this.saveWallet_();
  }
  
  createAddress() {
    let address = this.createECDSA_();
    this.saveWallet_();
    return address;
  }
  
  getAllAddress() {
    let adds = [];
    let indexKesy = Object.keys(this.hexKeys);
    for(let i = 0; i < indexKesy.length ;i++) {
      let address = indexKesy[i];
      adds.push(address);
    }
    return adds;
  }
  
  signTransaction(address,msgHash) {
    //console.log('signTransaction::address=<',address,'>');
    //console.log('signTransaction::msgHash=<',msgHash,'>');
    let key = this.rawKeys[address];
    //console.log('signTransaction::key=<',key,'>');
    let prvKey = key.prv;
    //console.log('signTransaction::prvKey=<',prvKey,'>');
    let signs = {};
    if(prvKey) {
      let signature = prvKey.sign(msgHash);
      //console.log('signTransaction::signature=<',signature,'>');
      let derSign = signature.toDER('hex');
      signs.msgSign = derSign;
      signs.msgOrig = msgHash;
    }
    let pubKey = key.pub;
    console.log('pubKey=<',pubKey,'>');
    let pub = pubKey.getPublic('hex');
    console.log('pub=<',pub,'>');
    let d = new SHA3.SHA3Hash();
    d.update(pub);
    let sumPub = d.digest('hex');
    console.log('sumPub=<',sumPub,'>');
    if(prvKey) {
      let signaturePub = prvKey.sign(sumPub);
      //console.log('signTransaction::signaturePub=<',signaturePub,'>');
      let pubSign = signaturePub.toDER('hex');
      signs.pubSign = pubSign;
      signs.pubOrig = sumPub;
    }
    return signs;
    
  }
    
  
  createECDSA_() {
    let key = ec.genKeyPair();
    let pub = key.getPublic('hex');
    //console.log('pub=<',pub,'>');
    let prv = key.getPrivate('hex');
    //console.log('prv=<',prv,'>');
    
    let d = new SHA3.SHA3Hash();
    d.update(pub);
    let sumPub = d.digest('hex');
    console.log('sumPub=<',sumPub,'>');

    let d2 = new SHA3.SHA3Hash(224);
    d2.update(sumPub);
    let sumPub2 = d2.digest('hex');
    //console.log('sumPub2=<',sumPub2,'>');
    let sumBuff = new Buffer.from(sumPub2);
    let address = bs58.encode(sumBuff);
    console.log('address=<',address,'>');
    
    this.hexKeys[address] = prv;
    return address;
  }
  
  loadWallet_() {
    let walletText_ = fs.readFileSync(this.path_, 'utf8');
    //console.log('loadWallet_::walletText_=<',walletText_,'>');
    let wallet = JSON.parse(walletText_);
    //console.log('loadWallet_::wallet=<',wallet,'>');
    this.hexKeys = wallet.hexKeys;
    let indexKesy = Object.keys(this.hexKeys);
    for(let i = 0; i < indexKesy.length ;i++) {
      let address = indexKesy[i];
      //console.log('loadWallet_::address=<',address,'>');
      let keyHex = this.hexKeys[address];
      //console.log('loadWallet_::keyHex=<',keyHex,'>');
      let prvKey = ec.keyFromPrivate(keyHex, 'hex');
      //console.log('loadWallet_::prvKey=<',prvKey,'>');
      let pubKey = prvKey.getPublic('hex');
      //console.log('loadWallet_::calPubKey=<',calPubKey,'>');
      this.rawKeys[address] = {pub:pubKey,prv:prvKey};
    }
  }
  
  
  saveWallet_() {
    let save = {};
    save.hexKeys = this.hexKeys;
    let saveJson = JSON.stringify(save,null, 2);
    fs.writeFileSync(this.path_,saveJson);
  }
}


/*
let myWallet = new Wallet('wallet.dat');
let address = myWallet.createAddress();
console.log('::address=<',address,'>');

let allAddr = myWallet.getAddress();
console.log('::allAddr=<',allAddr,'>');
if(allAddr.length > 0) {
  let address = allAddr[0];
  let trans = 'first';
  let d = new SHA3.SHA3Hash();
  d.update(trans);
  let hashTrans = d.digest('hex');
  let signature = myWallet.signTransaction(address,hashTrans);
  console.log('::address=<',address,'>');
  console.log('::hashTrans=<',hashTrans,'>');
  console.log('::signature=<',signature,'>');
}
myWallet.save();
*/



function isExistFile(file) {
  try {
    fs.statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') {
      return false
    }
  }
}

