const ipfsAPI = require('ipfs-api');
const ipfsPub = ipfsAPI('/ip4/127.0.0.1/tcp/5003');
const ipfsPri = ipfsAPI('/ip4/127.0.0.1/tcp/25002');

ipfsPub.id( (err, identity) => {
  if (err) {
    throw err;
  }
  console.log('ipfsPub identity=<',identity,'>');
});
ipfsPri.id( (err, identity) => {
  if (err) {
    throw err;
  }
  console.log('ipfsPri identity=<',identity,'>');
});

module.exports = class TaskIpfs {
  constructor() {
  }
  save(data,taskInfo,cb) {
    let dataStr = JSON.stringify(data);
    //console.log('save dataStr=<',dataStr,'>');
    const msgBuff = Buffer.from(dataStr);
    ipfsPri.add(msgBuff, function (err, files) {
      if(err) {
        throw err;
      }
      //console.log('save files=<',files,'>');
      if(files.length > 0) {
        if(typeof cb === 'function') {
           cb(files[0].path,taskInfo);
        }
      }
    });
  }
  
  publish(cid){
  }
};


/*
function finnishOneResourceBlock(blocks) {
  console.log('finnishOneResourceBlock blocks=<',blocks,'>');
  if(!blocks.finnish) {
    return;
  }
  //console.log('finnishOneResourceBlock oneBlockWords=<',oneBlockWords,'>');
  let oneBlockWordsStr = JSON.stringify(oneBlockWords);
  //console.log('finnishOneResourceBlock oneBlockWordsStr=<',oneBlockWordsStr,'>');
  const msgBuff = Buffer.from(oneBlockWordsStr);
  ipfs.add(msgBuff, function (err, files) {
    if(err) {
      throw err;
    }
    console.log('finnishOneResourceBlock files=<',files,'>');
    if(files.length > 0) {
      let blockAnnounce = {
        payment:cTestPaymentAddress,
        input:blocks.cid,
        group:blocks.group,
        task:blocks.task,
        output:files[0].path
      };
      console.log('finnishOneResourceBlock blockAnnounce=<',blockAnnounce,'>');
      taskPump.saveDone(blockAnnounce);
      publishKnowledge(blockAnnounce);
    }
  });
}
*/

