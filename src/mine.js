const SHA3  = require('sha3');

module.exports = class Mine {
  constructor() {
    this.nounce_ = 0;
  }
  run(msg,diffculty) {
    let diffcultyStr = '0'.repeat(diffculty);
    while(true) {
      let sum = this.calcSha3(msg + (this.nounce_).toString());
      if(sum.startsWith(diffcultyStr)) {
        return {nounce:this.nounce_,sum:sum};
      }
      this.nounce_++;
    }
  }  
  calcSha3(msg) {
    let d = new SHA3.SHA3Hash();
    d.update(msg);
    return d.digest('hex');
  }
  checkHash(msg,nounce,hash) {
    let orig = msg + nounce;
    //console.log('checkHash:orig=<',orig,'>');
    let d = new SHA3.SHA3Hash();
    d.update(orig);
    let hashCheck = d.digest('hex')
    //console.log('checkHash:hashCheck=<',hashCheck,'>');
    //console.log('checkHash:hash=<',hash,'>');
    return hash === hashCheck;
  }
}


