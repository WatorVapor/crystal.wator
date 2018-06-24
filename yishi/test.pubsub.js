const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');

const ipfsPubTopic = 'wai-test-pub';
const ipfsSubTopic = 'wai-test-sub';


const onRcvIpfsSub = (msg) => {
  console.log('onRcvIpfsCatchTask msg=<',msg,'>');
  console.log('onRcvIpfsCatchTask msg=<',msg.data.toString('utf8'),'>');
  //console.trace();
}
ipfs.pubsub.subscribe(ipfsSubTopic, onRcvIpfsSub,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe ipfsSubTopic=<',ipfsSubTopic,'>');
  const msgBuff = Buffer.from('test!!!!!!!!!!!!');
  ipfs.pubsub.publish(ipfsPubTopic, msgBuff, (err) => {
    if (err) {
      throw err;
    }
  });
});
