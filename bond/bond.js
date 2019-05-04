const fs = require('fs');
const crypto = require('crypto');
const rs = require('jsrsasign');
const bs58 = require('bs58');

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
    this.prvKey = prvKey;
    this.rsPrvKey = ecKeypair.prvKeyObj;
    this.prvHex = ecKeypair.prvKeyObj.prvKeyHex;
    let pubKey = rs.KEYUTIL.getJWKFromKey(ecKeypair.pubKeyObj);
    //console.log('_createKeyPair::pubKey=<',pubKey,'>');
    let toBeSaved = {
      prvKey:prvKey,
      pubKey:pubKey
    };
    let keyBuffer = Buffer.from(ecKeypair.pubKeyObj.pubKeyHex,'hex');
    this.pubKeyB58 = bs58.encode(keyBuffer);
    this.pubKey = pubKey;
    this.pubJwk = pubKey;
    this.rsPubKey = ecKeypair.pubKeyObj;
    fs.writeFileSync(this.keyPath_,JSON.stringify(toBeSaved,undefined,2));
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
    this.prvHex = this.rsPrvKey.prvKeyHex;
    this.rsPubKey = rs.KEYUTIL.getKey(keyJson.pubKey);
    let keyBuffer = Buffer.from(this.rsPubKey.pubKeyHex,'hex');
    this.pubKeyB58 = bs58.encode(keyBuffer);
    this.pubJwk = keyJson.pubKey;
  }
}

module.exports = BondCrypto_;
