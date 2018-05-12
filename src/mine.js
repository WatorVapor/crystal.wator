const SHA3  = require('sha3');

const diffculty = '0000';
module.exports = class Mine {
  constructor() {
    this.nounce_ = 0;
  }
  run(msg) {
    while(true) {
      let sum = this.calcSha3(msg + (this.nounce_++).toString());
      if(sum.startsWith(diffculty)) {
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


