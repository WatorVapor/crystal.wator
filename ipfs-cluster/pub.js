const IPFS = require('ipfs');
const node = new IPFS();
node.on('ready', () => {
  console.log('ready');
  node.id(function (err, identity) {
    if (err) {
      throw err
    }
    console.log('identity=<',identity,'>');
  })
})

