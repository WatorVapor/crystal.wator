const fs = require('fs');
const crypto = require('crypto');
const rs = require('jsrsasign');
const bs58 = require('bs58');
const SHA3  = require('sha3');

const SIGN_MINE_START = '00';

class BondCrypto_ {
  /**
   * Create a new `BondCrypto_`.
   *
   */
  constructor () {
    if(!fs.existsSync('.keys/')) {
      fs.mkdirSync('.keys/');
    }
    this.keyPath_ = '.keys/key.json';
    if(!fs.existsSync(this.keyPath_)) {
      this._createKeyPair();
    } else {
      this._loadKeyPair();
    }
  }
  
  signMine(input,output) {
    let start = new Date();
    let msgSign = {input:input,output:output,pay:this.addB58};
    while(true) {
      let mineNow = new Date();
      msgSign.owner = {};
      msgSign.owner.date = mineNow.toUTCString();
      msgSign.owner.msec = mineNow.getMilliseconds();
      
      let signEngine = new rs.KJUR.crypto.Signature({alg: 'SHA256withECDSA'});
      signEngine.init({d: this.rsPrvKey.prvKeyHex, curve: 'secp256r1'});
      signEngine.updateString(JSON.stringify(msgSign));
      let signatureHex = signEngine.sign();
      //console.log('signMine signatureHex=<' , signatureHex , '>');
      let hashSign = rs.KJUR.crypto.Util.sha256(signatureHex);
      //console.log('signMine hashSign=<' , hashSign , '>');
      if(hashSign.startsWith(SIGN_MINE_START)) {
        const bufSign = Buffer.from(signatureHex, 'hex');
        msgSign.owner.sign = bs58.encode(bufSign);
        const bufHash = Buffer.from(hashSign, 'hex');
        msgSign.owner.hash = bs58.encode(bufHash);
        break;
      }
    }
    //console.log('signMine::msgSign=<',msgSign,'>');
    let end = new Date();
    let escape = end - start;
    console.log('signMine::escape=<',escape,'>');
    return msgSign;
  }



  /**
   * create key pair.
   *
   * @private
   */
  _createKeyPair() {
    const ecKeypair = rs.KEYUTIL.generateKeypair("EC", "P-256");
    //console.log('_createKeyPair::ecKeypair=<',ecKeypair,'>');
    let prvKey = rs.KEYUTIL.getJWKFromKey(ecKeypair.prvKeyObj);
    //console.log('_createKeyPair::prvKey=<',prvKey,'>');
    let pubKey = rs.KEYUTIL.getJWKFromKey(ecKeypair.pubKeyObj);
    //console.log('_createKeyPair::pubKey=<',pubKey,'>');
    let toBeSaved = {
      prvKey:prvKey,
      pubKey:pubKey
    };
    fs.writeFileSync(this.keyPath_,JSON.stringify(toBeSaved,undefined,2));
    this.rsPubKey = ecKeypair.pubKeyObj;
    this.rsPrvKey = ecKeypair.prvKeyObj;    
    let keyBuffer = Buffer.from(ecKeypair.pubKeyObj.pubKeyHex,'hex');
    this.pubB58 = bs58.encode(keyBuffer);
    let d = new SHA3.SHA3Hash(224);
    d.update(ecKeypair.pubKeyObj.pubKeyHex);
    this.addB58 = bs58.encode(Buffer.from(d.digest('hex'),'hex'));
  }

  /**
   * load key pair.
   *
   * @private
   */
  _loadKeyPair() {
    let keyStr = fs.readFileSync(this.keyPath_, 'utf8');
    let keyJson = JSON.parse(keyStr);
    //console.log('_loadKeyPair::keyJson=<',keyJson,'>');
    this.rsPrvKey = rs.KEYUTIL.getKey(keyJson.prvKey);
    this.rsPubKey = rs.KEYUTIL.getKey(keyJson.pubKey);
    let keyBuffer = Buffer.from(this.rsPubKey.pubKeyHex,'hex');
    this.pubB58 = bs58.encode(keyBuffer);
    let d = new SHA3.SHA3Hash(224);
    d.update(this.rsPubKey.pubKeyHex);
    this.addB58 = bs58.encode(Buffer.from(d.digest('hex'),'hex'));
  }
}

module.exports = BondCrypto_;
