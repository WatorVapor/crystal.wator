const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

/*
ipfs.id((err, identity) =>{
  if (err) {
    throw err;
  }
  console.log('ipfs.id identity=<',identity,'>');
});
*/


ipfs.config.get((err, config) => {
  if (err) {
    throw err
  }
  console.log('ipfs.config.get * config=<',config,'>');
})

ipfs.config.get('Addresses',(err, config) => {
  if (err) {
    throw err
  }
  console.log('ipfs.config.get Addresses config=<',config,'>');
})

