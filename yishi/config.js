const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5003');

ipfs.config.get((err, config) => {
  if (err) {
    throw err
  }
  console.log(config)
});

