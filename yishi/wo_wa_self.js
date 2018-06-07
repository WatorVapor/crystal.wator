const SHA3  = require('sha3');
const fs = require('fs');
const crypto = require('crypto');

const EC = require('elliptic').ec;
const ec = new EC('p521');
//console.log('ec=<',ec,'>');
const bs58 = require('bs58')



module.exports = class WoWaSelf {
  
  constructor(path) {
    if(path) {
      this.path_ = path;
    } else {
      this.path_ = 'wowaself.dat';
    }
    if(!isExistFile(this.path_)) {
      this.hexKeys = {};
      this.createECDSA_('init wowa');
      this.saveWoWaSelf_();
    }
    this.rawKeys = {};
    this.loadWoWaSelf_();
    //console.log('this=<',this,'>');
  }
  
  signKnowledge(cid) {
    let d = new SHA3.SHA3Hash();
    d.update(cid);
    let sumCid = d.digest('hex');
    console.log('signKnowledge::sumCid=<',sumCid,'>');
    let signed = {knowHash:sumCid};
    return signed;
  }
  
  save() {
    this.saveWoWaSelf_();
  }
  createECDSA_(comment) {
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
    let address = 'Wo1' + bs58.encode(sumBuff);
    console.log('address=<',address,'>');
    
    this.hexKeys[address] = {key:prv,comment:comment};
    return address;
  }
  
  loadWoWaSelf_() {
    let walletText_ = fs.readFileSync(this.path_, 'utf8');
    //console.log('loadWallet_::walletText_=<',walletText_,'>');
    let wallet = JSON.parse(walletText_);
    //console.log('loadWallet_::wallet=<',wallet,'>');
    this.hexKeys = wallet.hexKeys;
    let indexKesy = Object.keys(this.hexKeys);
    for(let i = 0; i < indexKesy.length ;i++) {
      let address = indexKesy[i];
      //console.log('loadWallet_::address=<',address,'>');
      let keyHex = this.hexKeys[address].key;
      //console.log('loadWallet_::keyHex=<',keyHex,'>');
      let prvKey = ec.keyFromPrivate(keyHex, 'hex');
      //console.log('loadWallet_::prvKey=<',prvKey,'>');
      let pubKey = prvKey.getPublic('hex');
      //console.log('loadWallet_::calPubKey=<',calPubKey,'>');
      this.rawKeys[address] = {pub:pubKey,prv:prvKey};
    }
  }
  
  
  saveWoWaSelf_() {
    let save = {};
    save.hexKeys = this.hexKeys;
    let saveJson = JSON.stringify(save,null, 2);
    fs.writeFileSync(this.path_,saveJson);
  }
}



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

