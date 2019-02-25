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

/*
ipfs.config.get((err, config) => {
  if (err) {
    throw err
  }
  console.log('ipfs.config.get * config=<',config,'>');
})
*/

ipfs.config.set('Addresses.API', '/ip4/127.0.0.1/tcp/5001', (err) => {
  if (err) {
    throw err
  }
})

ipfs.config.get('Addresses.API',(err, config) => {
  if (err) {
    throw err
  }
  console.log('ipfs.config.get Addresses.API config=<',config,'>');
})

ipfs.config.set('Addresses.Gateway', '/ip4/127.0.0.1/tcp/8080', (err) => {
  if (err) {
    throw err
  }
})

ipfs.config.get('Addresses.Gateway',(err, config) => {
  if (err) {
    throw err
  }
  console.log('ipfs.config.get Addresses.Gateway config=<',config,'>');
})


