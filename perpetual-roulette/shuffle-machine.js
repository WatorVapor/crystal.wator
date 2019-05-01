const IPFS = require('ipfs');
const config = { 
  repo: './ipf_repos_address_only',
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


class ShuffleMachine_ {
  constructor() {
  }
  async address(content) {
    let contentBuf = Buffer.from( content);
    let addOpt = {onlyHash:true};
    let results = await node.add(contentBuf,addOpt);
    //console.log('address results=<',results,'>');
    if(results.length > 0) {
      return results[0].hash;
    }
  }
};

module.exports = {
  ShuffleMachine:ShuffleMachine_
};
