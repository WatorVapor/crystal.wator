const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5004');
const Room = require('ipfs-pubsub-room-----------111111111111111');

ipfs.id( (err, identity) => {
  if (err) {
    throw err;
    process.exit();
  }
  //console.log('identity=<',identity,'>');
});

const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');

const redis = require("redis");
let pubRedis = redis.createClient();
let subRedis = redis.createClient();

pubRedis.on("ready", (err) => {
  console.log('pubRedis err=<',err,'>');
});




const redisPubChannel = 'wai.relay.ipfs.to.redis';
const redisSubChannel = 'wai.relay.redis.to.ipfs';



subRedis.on("message", function(channel, msg) {
  //console.log('subRedis.on channel=<',channel,'>');
  //console.log('subRedis.on msg=<',msg,'>');
  let jsonMsg = JSON.parse(msg);
  if(jsonMsg) {
    //console.log('subRedis.on jsonMsg=<',jsonMsg,'>');
    if(jsonMsg.word) {
      collectWords(jsonMsg.word);
    } else {
      //console.log('subRedis.on jsonMsg=<',jsonMsg,'>');
      finnishOneResourceBlock(jsonMsg);
    }
  }
});


subRedis.on("ready", (err) => {
  console.log('subRedis err=<',err,'>');
});
subRedis.subscribe(redisSubChannel);





let oneBlockWords = {};
function collectWords(words) {
  //console.log('collectWords words=<',words,'>');
  for(let i = 0;i < words.length ; i++) {
    let wordRank = words[i];
    //console.log('collectWords wordRank=<',wordRank,'>');
    let keys = Object.keys(wordRank);
    //console.log('collectWords keys=<',keys,'>');
    let word = keys[0];
    if(oneBlockWords[word]) {
      oneBlockWords[word] += wordRank[word];
      //console.log('collectWords oneBlockWors[word]=<',oneBlockWors[word],'>');
    } else {
      oneBlockWords[word] = wordRank[word];
    }
  }
}

const crystal = require('./crystal.wator.json');
console.log('crystal=<',crystal,'>');
const cTestPaymentAddress = crystal.payaddress;
console.log('cTestPaymentAddress=<',cTestPaymentAddress,'>');



const ipfsSubTopicNewTask = 'wai-ipfs-yishi-new-task';
const ipfsPubTopicCatchTask = 'wai-ipfs-yishi-catch-task';



const onRcvIpfsNewTaskMsg = (msg) => {
  console.log('onRcvIpfsNewTaskMsg msg=<',msg,'>');
  //console.log('onRcvIpfsNewTaskMsg msg=<',msg.data.toString('utf8'),'>');
  //console.trace();
  setTimeout(function(){
    broadCastCathTask(msg.data);
  },0);
  scheduleTask(msg.data.toString('utf8'));
}
ipfs.pubsub.subscribe(ipfsSubTopicNewTask, onRcvIpfsNewTaskMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe ipfsSubTopicNewTask=<',ipfsSubTopicNewTask,'>');
});

ipfs.pubsub.peers(ipfsSubTopicNewTask, (err, peerIds) => {
  if (err) {
    return console.error(`failed to get peers subscribed to ${ipfsSubTopicNewTask}`, err)
  }
  console.log(peerIds)
})

function scheduleTask(blockCid) {
  console.log('blockCid=<',blockCid,'>');
  let taskJson = {block:blockCid,task:'wator.ipfs.ostrich.app'};
  pubRedis.publish(redisPubChannel,JSON.stringify(taskJson));
}
function broadCastCathTask(msg){
  let msgJson = JSON.parse(msg.toString('utf8'));
  console.log('broadCastCathTask::msgJson=<',msgJson,'>');
  let catchSign = myWoWa.signNewTask(msgJson.cid);
  msgJson.catch = catchSign;
  const msgBuff = Buffer.from(JSON.stringify(msgJson));
  ipfs.pubsub.publish(ipfsPubTopicCatchTask, msgBuff, (err) => {
    if (err) {
      throw err;
    }
    //console.log('sented msgBuff=<',msgBuff,'>');
  });
}


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




function publishKnowledge(know) {
  //console.log('publishResult know=<',know,'>');
  let outputCID = know.output;
  //console.log('publishResult outputCID=<',outputCID,'>');
  //console.log('publishResult know=<',know,'>');
  let output = myWoWa.signNewKnowledge(outputCID);
  //console.log('publishResult output=<',output,'>');
  know.output = output;
  //console.log('publishResult know=<',JSON.stringify(know),'>');
  broadCastKnowlege(JSON.stringify(know));
}


const ipfsSubTopicVerified = 'wai-ipfs-yishi-verified';
const ipfsPubTopicCreated = 'wai-ipfs-yishi-created';

const onRcvIpfsVerifiedMsg = (msg) => {
  console.log('onRcvIpfsVerifiedMsg msg=<',msg,'>');
  console.log('onRcvIpfsVerifiedMsg msg=<',msg.data.toString('utf8'),'>');
  //console.trace();
}
ipfs.pubsub.subscribe(ipfsSubTopicVerified, onRcvIpfsVerifiedMsg,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe ipfsSubTopicVerified=<',ipfsSubTopicVerified,'>');
});

ipfs.pubsub.peers(ipfsSubTopicVerified, (err, peerIds) => {
  if (err) {
    return console.error(`failed to get peers subscribed to ${ipfsSubTopicVerified}`, err)
  }
  console.log(peerIds)
})


function broadCastKnowlege(know) {
  const msgBuff = Buffer.from(know);
  ipfs.pubsub.publish(ipfsPubTopicCreated, msgBuff, (err) => {
    if (err) {
      throw err;
    }
    //console.log('sented msgBuff=<',msgBuff,'>');
    taskPump.fetchOne(scheduleTask);
  });
}
