const ipfsClient = require('ipfs-http-client');
let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5003');
console.log('ipfs=<',ipfs,'>');
ipfs.config.set('API.HTTPHeaders.Access-Control-Allow-Origin', '["https://ipfs.wator.xyz", "http://127.0.0.1:5003", "https://webui.ipfs.io"]', (err) => {
  if (err) {
    throw err
  }
  // MDNS Discovery was set to false
})

ipfs.config.set('API.HTTPHeaders.Access-Control-Allow-Methods', '["PUT", "GET", "POST"]', (err) => {
  if (err) {
    throw err
  }
  // MDNS Discovery was set to false
})


