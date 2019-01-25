const IPFS = require('ipfs');
const node = new IPFS();
node.on('ready', () => {
  node.id(function (err, identity) {
    if (err) {
      throw err
    }
    console.log('identity=<',identity,'>');
  })
})

