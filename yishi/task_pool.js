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
  p2p.in(CHANNEL.KNOWLEDGE.VERIFY,onKnowledgeVerify);
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
  let output = myWoWa.signNewKnowledge(cidResult);
  let blockAnnounce = {
    payment:cTestPaymentAddress,
    input:taskInfo.cid,
    group:taskInfo.group,
    task:taskInfo.task,
    output:output
  };
  console.log('onSaveCID blockAnnounce=<',blockAnnounce,'>');
  p2p.out(CHANNEL.KNOWLEDGE.CREATE,blockAnnounce);
}

onKnowledgeVerify = (msg)=>{
  console.log('onKnowledgeVerify::msg=<',msg,'>');
};

