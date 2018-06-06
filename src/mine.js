const SHA3  = require('sha3');

module.exports = class Mine {
  constructor() {
    this.nounce_ = 0;
  }
  run(msg,diffculty) {
    let diffcultyStr = '0'.repeat(diffculty);
    while(true) {
      let sum = this.calcSha3(msg + (this.nounce_++).toString());
      if(sum.startsWith(diffcultyStr)) {
        return {nounce:this.nounce_,sum:sum};
      }
    }
  }  
  calcSha3(msg) {
    let d = new SHA3.SHA3Hash();
    d.update(msg);
    return d.digest('hex');
  }
}


