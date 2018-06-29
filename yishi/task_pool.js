const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5003');

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



const WoWaP2P  = require('./wo_wa_p2p.js');
const CHANNEL  = require('./channel.js');
let p2p = new WoWaP2P();
p2p.onReady = () => {
  p2p.in(CHANNEL.TASK.CREATE,onCREATETask);
}
onCreateTask = (msg)=>{
  console.log('onCreateTask::msg=<',msg,'>');
  scheduleTask(msg.cid);
  broadCastCathTask(msg);
};


function scheduleTask(blockCid) {
  console.log('blockCid=<',blockCid,'>');
  let taskJson = {block:blockCid,task:'wator.ipfs.ostrich.app'};
  pubRedis.publish(redisPubChannel,JSON.stringify(taskJson));
}

const ipfsPubTopicCatchTask = 'wai-task-catch';

function broadCastCathTask(msgJson){
  let catchSign = myWoWa.signTask(msgJson.cid);
  msgJson.catch = catchSign;
  p2p.out(CHANNEL.TASK.CATCH ,msgJson);
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





function broadCastKnowlege(know) {
  const msgBuff = Buffer.from(know);
  /*
  ipfs.pubsub.publish(ipfsPubTopicCreated, msgBuff, (err) => {
    if (err) {
      throw err;
    }
    //console.log('sented msgBuff=<',msgBuff,'>');
    taskPump.fetchOne(scheduleTask);
  });
  */
}
