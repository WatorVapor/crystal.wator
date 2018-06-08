const SHA3  = require('sha3');
const fs = require('fs');
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('p521');
//console.log('ec=<',ec,'>');
const bs58 = require('bs58')
const NodeRSA = require('node-rsa');




module.exports = class WoWaSelf {
  
  constructor(path) {
    if(path) {
      this.path_ = path;
    } else {
      this.path_ = 'wowaself.dat';
    }
    if(!isExistFile(this.path_)) {
      this.hexKeys = {};
      this.createECDSA_();
      this.createRSA_();
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
      timestamp:[
        {
          orig:timestamp,
          sign:derSignTS,
          pubHex:this.pubHex
        }
      ]
    };
    return signed;
  }
  
  save() {
    this.saveWoWaSelf_();
  }
  createECDSA_() {
    let key = ec.genKeyPair();
    this.key = key;
    let pub = key.getPublic('hex');
    this.pubHex = pub;
    //console.log('createECDSA_::pub=<',pub,'>');
    let prv = key.getPrivate('hex');
    this.prvHex = prv;
  }
  
  createRSA_() {
    let keyRSA = new NodeRSA();
    keyRSA.generateKeyPair();
    console.log('createRSA_:: keyRSA=<',keyRSA,'>');
    console.log('createRSA_:: keyRSA.isPrivate()=<',keyRSA.isPrivate(),'>');   
    console.log('createRSA_:: keyRSA.isPublic()=<',keyRSA.isPublic(),'>');   
    let prvRSA = keyRSA.exportKey('pkcs8');
    console.log('createRSA_:: prvRSA=<',prvRSA,'>');
    this.prvRSAHex = prvRSA;
    let pubRSA = keyRSA.exportKey('pkcs8-public');
    this.pubRSAHex = pubRSA;
    console.log('createRSA_:: pubRSA=<',pubRSA,'>');

    this.prvRSA = new NodeRSA();
    this.prvRSA.importKey(this.prvRSAHex);    
    this.pubRSA = new NodeRSA();
    this.pubRSA.importKey(this.pubRSAHex);
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

    this.prvRSA = new NodeRSA();
    this.prvRSA.importKey(wowa.RSAHex.prv);
    this.prvRSAHex = wowa.RSAHex.prv;
    
    this.pubRSA = new NodeRSA();
    this.pubRSA.importKey(wowa.RSAHex.pub);
    this.pubRSA = wowa.RSAHex.pub;
  }
  
  
  saveWoWaSelf_() {
    let save = {};
    save.prvHex = this.prvHex;
    save.RSAHex = {};
    save.RSAHex.prv = this.prvRSAHex;
    save.RSAHex.pub = this.pubRSAHex;
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

