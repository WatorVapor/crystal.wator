const IPFS = require('ipfs');
const config = { 
  repo: './.ipf_repos_address_only',
};
const node = new IPFS(config);
node.on('ready', () => {
  onIpfsReady(node);
});

onIpfsReady = (ipfs) => {
  ipfs.id((err, identity) => {
    if (err) {
      throw err;
    }
    console.log('ShuffleMachine_ onIpfsReady identity=<',identity,'>');
  });
};

const BondCrypto = require('../bond/bond');

const fs = require('fs');
const execSync = require('child_process').execSync;
const BLOCK_CHAIN_STORAGE_ROOT = './.block_chain_storage';

class ShuffleMachine_ {
  constructor() {
    let code = execSync('mkdir -p ' + BLOCK_CHAIN_STORAGE_ROOT);
    console.log('ShuffleMachine_ code=<',code,'>');
    this.bond_ = new BondCrypto();
  }
  async address(jContent,content,cb) {
    let contentBuf = Buffer.from( content);
    let addOpt = {onlyHash:true};
    let results = await node.add(contentBuf,addOpt);
    //console.log('address results=<',results,'>');
    if(results.length > 0) {
      let msgAddress = results[0].hash;
      this.save2Local_(content,msgAddress);
      this.mining_(jContent,msgAddress,cb);
    }
  }
  save2Local_(content,contentAdd) {
    console.log('save2Local_ contentAdd=<',contentAdd,'>');
    let path =  BLOCK_CHAIN_STORAGE_ROOT + '/' + contentAdd;
    console.log('save2Local_ path=<',path,'>');
    fs.writeFileSync(path,content);
  }
  mining_(jContent,contentAdd,cb){
    console.log('mining_ contentAdd=<',contentAdd,'>');
  }
};

module.exports = {
  ShuffleMachine:ShuffleMachine_
};
