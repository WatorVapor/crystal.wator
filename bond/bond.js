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

}

module.exports = BondCrypto_;
