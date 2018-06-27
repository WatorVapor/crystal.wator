const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5003');
const ipfs2 = ipfsAPI('/ip4/127.0.0.1/tcp/5004');

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
  const msgBuff = Buffer.from('ipfs test!!!!!!!!!!!!');
  ipfs.pubsub.publish(ipfsSubTopic, msgBuff, (err) => {
    if (err) {
      throw err;
    }
  });
});


ipfs2.pubsub.subscribe(ipfsSubTopic, onRcvIpfsSub,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe ipfsSubTopic=<',ipfsSubTopic,'>');
  const msgBuff = Buffer.from('ipfs2 test!!!!!!!!!!!!');
  ipfs2.pubsub.publish(ipfsSubTopic, msgBuff, (err) => {
    if (err) {
      throw err;
    }
  });
});
