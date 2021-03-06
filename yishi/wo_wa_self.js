const SHA3  = require('sha3');
const fs = require('fs');
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('p192');
//console.log('ec=<',ec,'>');
const NodeRSA = require('node-rsa');

const diffcultyStr = '0'.repeat(2);



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
  
  signKnowledge(content) {
    //console.log('this.pubHex=<',this.pubHex,'>');
    let signature = this.key.sign(content);
    let derSign = signature.toDER();
    let d = new SHA3.SHA3Hash();
    let signOrig = Buffer.from(derSign).toString('base64');
    d.update(signOrig);
    let nounceOfContent = d.digest('hex');
    //console.log('signKnowledge::nounceOfContent=<',nounceOfContent,'>');
    
    let timestamp = this.mineTimeStamp_(nounceOfContent);
    let signed = {
      nounce:nounceOfContent,
      ts_created:timestamp
    };
    return signed;
  }
  
  verifyKnowledge(know,ts,checkEscape){
    //console.log('verifyKnowledge::know=<',know,'>');
    //console.log('verifyKnowledge::ts=<',ts,'>');
    if(!ts.hash.startsWith(diffcultyStr)) {
      return false;
    }
    let now = new Date();
    let createTSTemp = ts.orig.ts.split('GMT.');
    //console.log('verifyKnowledge::createTS=<',createTSTemp,'>');
    if(createTSTemp.length < 2 && checkEscape === true) {
      return false
    }
    let createTS = createTSTemp[0] + 'GMT';
    let createdTime = new Date(createTS);
    //console.log('verifyKnowledge::createdTime=<',createdTime,'>');
    //console.log('verifyKnowledge::now=<',now,'>');
    let diff = now - createdTime;
    //console.log('verifyKnowledge::diff=<',diff,'>');
    if(diff > 60 * 1000) {
       return false;
    }

    let d = new SHA3.SHA3Hash();
    d.update(ts.orig.ts + know);
    let signHash = d.digest('hex');
    //console.log('verifyKnowledge::signHash=<',signHash,'>');
    if(ts.orig.hash !== signHash) {
      return false;
    }
    
    let dT = new SHA3.SHA3Hash();
    dT.update(ts.sign);
    let verifyHash = dT.digest('hex');
    //console.log('verifyKnowledge::verifyHash=<',verifyHash,'>');
    if(ts.hash !== verifyHash) {
      return false;
    }
    
    // check ecrsa.
    let pubKey = ec.keyFromPublic(ts.pub, 'hex');
    //console.log('verifyKnowledge::pubKey=<',pubKey,'>');
    //console.log('verifyKnowledge::pubKey=<',pubKey,'>');
    let verify = pubKey.verify(ts.orig.hash, ts.sign);
    //console.log('verifyKnowledge::verify=<',verify,'>');
    return verify;
  }
  

  signTask(cid) {
    //console.log('this.pubHex=<',this.pubHex,'>');
    let signature = this.key.sign(cid);
    let derSign = signature.toDER();
    let d = new SHA3.SHA3Hash();
    let signOrig = Buffer.from(derSign).toString('base64');
    d.update(signOrig);
    let nounceOfContent = d.digest('hex');
    //console.log('signKnowledge::nounceOfContent=<',nounceOfContent,'>');
    
    let timestamp = this.mineTimeStamp_(cid);
    let signed = {
      nounce:nounceOfContent,
      ts_created:timestamp
    };
    return signed;
  }
  
  createTimeStamp(sumCid) {
    let ts = this.mineTimeStamp_(sumCid);
    return ts;
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
    this.pubRSAHex = wowa.RSAHex.pub;
    this.pubRSAb64 = Buffer.from(wowa.RSAHex.pub).toString('base64');
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
  
  mineTimeStamp_(hash) {
    while(true) {
      let now = new Date();
      let timestamp = now.toUTCString();
      timestamp += '.' 
      timestamp += now.getUTCMilliseconds().toString().padStart(3, "0");
      timestamp += 'ms';
      let dT = new SHA3.SHA3Hash();
      dT.update(timestamp + hash);
      let origHash = dT.digest('hex');
      
      let signatureTS = this.key.sign(origHash);
      //console.log('mineTimeStamp_::signatureTS=<',signatureTS,'>');
      signatureTS = signatureTS.toDER('hex').toString('base64');
      //console.log('mineTimeStamp_::typeof signatureTS=<',typeof signatureTS,'>');
      //console.log('mineTimeStamp_::signatureTS=<',signatureTS,'>');
      
      let d = new SHA3.SHA3Hash();
      d.update(signatureTS);
      let signHash = d.digest('hex');
      if(signHash.startsWith(diffcultyStr)) {
        let ts = 
        {
          orig:{
            ts:timestamp,
            hash:origHash
          },
          sign:signatureTS,
          hash:signHash,
          pub:this.pubHex
        };
        return ts;
      }
    }
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

