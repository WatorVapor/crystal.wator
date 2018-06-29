const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');

const TaskStorageIpfs  = require('./task_storage.js');
let storage = new TaskStorageIpfs();

let gWorkerIsBusy = false;
const TaskWorker = require('./task_worker.js');
let worker = new TaskWorker();
worker.onReadyOneBlock = (taskInfo,words) => {
  console.log('worker.onReadyOneBlock taskInfo=<',taskInfo,'>');
  gWorkerIsBusy = false;
  storage.save(words,taskInfo,onSaveCID);
};

const crystal = require('./crystal.wator.json');
console.log('crystal=<',crystal,'>');
const cTestPaymentAddress = crystal.payaddress;
console.log('cTestPaymentAddress=<',cTestPaymentAddress,'>');



const WoWaP2P  = require('./wo_wa_p2p.js');
const CHANNEL  = require('./channel.js');
let p2p = new WoWaP2P();
p2p.onReady = () => {
  p2p.in(CHANNEL.TASK.CREATE,onCreateTask);
};
onCreateTask = (msg)=>{
  console.log('onCreateTask::msg=<',msg,'>');
  if(gWorkerIsBusy) {
    console.log('onCreateTask:: gWorkerIsBusy=<',gWorkerIsBusy,'>','ignore!!!!');
  } else {
    scheduleTask(msg.cid);
    broadCastCathTask(msg);
    gWorkerIsBusy = true;
  }
};


function scheduleTask(blockCid) {
  console.log('blockCid=<',blockCid,'>');
  worker.out(blockCid);
}


function broadCastCathTask(msgJson){
  let catchSign = myWoWa.signTask(msgJson.cid);
  msgJson.catch = catchSign;
  p2p.out(CHANNEL.TASK.CATCH ,msgJson);
}

function onSaveCID(cidResult,taskInfo) {
  console.log('onSaveCID cidResult=<',cidResult,'>');
  console.log('onSaveCID taskInfo=<',taskInfo,'>');
}
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
}
