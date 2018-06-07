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
  
  signNewKnowledge(cid) {
    console.log('this.pubHex=<',this.pubHex,'>');
    let signature = this.key.sign(cid);
    let derSign = signature.toDER();
    let d = new SHA3.SHA3Hash();
    d.update(bs58.encode(derSign));
    let sumCid = d.digest('hex');
    console.log('signKnowledge::sumCid=<',sumCid,'>');
    let now = new Date();
    let timestamp = now.toUTCString();

    let signatureTS = this.key.sign(timestamp);
    let derSignTS = bs58.encode(signatureTS.toDER());
    let signed = {
      knowHash:sumCid,
      ts:[
        {
          orig:timestamp,
          sign:derSignTS
        }
      ],
      pubHex:this.pubHex
    };
    return signed;
  }
  
  save() {
    this.saveWoWaSelf_();
  }
  createECDSA_(comment) {
    let key = ec.genKeyPair();
    this.key = key;
    let pub = key.getPublic('hex');
    this.pubHex = pub;
    //console.log('pub=<',pub,'>');
    let prv = key.getPrivate('hex');
    this.prvHex = prv;
  }
  
  loadWoWaSelf_() {
    let wowaText_ = fs.readFileSync(this.path_, 'utf8');
    //console.log('loadWoWaSelf_::wowaText_=<',wowaText_,'>');
    let wowa = JSON.parse(wowaText_);
    //console.log('loadWoWaSelf_::wowa=<',wowa,'>');
    this.key = ec.keyFromPrivate(wowa.prvHex, 'hex');;
    let pub = this.key.getPublic('hex');
    //console.log('pub=<',pub,'>');
    this.pubHex = pub;
  }
  
  
  saveWoWaSelf_() {
    let save = {};
    save.prvHex = this.prvHex;
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

