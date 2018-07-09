const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');

const WoWaP2P  = require('./wo_wa_p2p.js');
const CHANNEL  = require('./channel.js');
let p2p = new WoWaP2P();

const TaskStorageIpfs  = require('./task_storage.js');
let storage = new TaskStorageIpfs();
const KnowledgeChain  = require('./knowledge_chain.js');
let chain = new KnowledgeChain();

let gWorkerIsBusy = false;
const TaskWorker = require('./task_worker.js');
let worker = new TaskWorker();
worker.onReadyOneBlock = (taskInfo,words) => {
  //console.log('worker.onReadyOneBlock taskInfo=<',taskInfo,'>');
  gWorkerIsBusy = false;
  storage.save(words,taskInfo,onSaveCID);
  p2p.out(CHANNEL.TASK.WANT,{});
};

const crystal = require('./crystal.wator.json');
console.log('crystal=<',crystal,'>');
const cTestPaymentAddress = crystal.payaddress;
console.log('cTestPaymentAddress=<',cTestPaymentAddress,'>');




p2p.onReady = () => {
  p2p.in(CHANNEL.TASK.CREATE,onCreateTask);
  p2p.in(CHANNEL.KNOWLEDGE.VERIFY,onKnowledgeVerify);
};
p2p.onJoint = () => {
  setTimeout( () => {
    p2p.out(CHANNEL.TASK.WANT,{});
  },1000);
}

onCreateTask = (msg,from)=>{
  //console.log('onCreateTask::msg=<',msg,'>');
  //console.log('onCreateTask::from=<',from,'>');
  if(gWorkerIsBusy) {
    console.log('onCreateTask:: gWorkerIsBusy=<',gWorkerIsBusy,'>','ignore!!!!');
  } else {
    scheduleTask(msg.cid);
    sendCathTask(msg,from);
    gWorkerIsBusy = true;
  }
};


function scheduleTask(blockCid) {
  //console.log('blockCid=<',blockCid,'>');
  worker.out(blockCid);
}


function sendCathTask(msgJson,to){
  let catchSign = myWoWa.signTask(msgJson.cid);
  msgJson.catch = catchSign;
  p2p.out(CHANNEL.TASK.CATCH ,msgJson,to);
}

function broadCastCathTask(msgJson){
  let catchSign = myWoWa.signTask(msgJson.cid);
  msgJson.catch = catchSign;
  p2p.out(CHANNEL.TASK.CATCH ,msgJson);
}


function onSaveCID(cidResult,taskInfo) {
  console.log('onSaveCID output cidResult=<',cidResult,'>');
  console.log('onSaveCID input taskInfo.cid=<',taskInfo.cid,'>');
  let output = myWoWa.signKnowledge(cidResult);
  let nounce = output.nounce;
  console.log('onSaveCID nounce=<',nounce,'>');
  storage.saveNounce(nounce,cidResult);
  let blockAnnounce = {
    payment:cTestPaymentAddress,
    input:taskInfo.cid,
    group:taskInfo.group,
    task:taskInfo.task,
    output:output
  };
  //console.log('onSaveCID blockAnnounce=<',blockAnnounce,'>');
  p2p.out(CHANNEL.KNOWLEDGE.CREATE,blockAnnounce);
  let taskDone = {
    input:taskInfo.cid,
    output:cidResult
  };
  //console.log('onSaveCID taskDone=<',taskDone,'>');
  p2p.out(CHANNEL.TASK.DONE,taskDone);
}

onKnowledgeVerify = (msg)=>{
  //console.log('onKnowledgeVerify::msg=<',msg,'>');
  let goodCreated = myWoWa.verifyKnowledge(msg.output.nounce,msg.output.ts_created);
  let goodVerified = myWoWa.verifyKnowledge(msg.output.nounce,msg.output.ts_created,true);
  console.log('onKnowledgeVerify::goodCreated=<',goodCreated,'>');
  console.log('onKnowledgeVerify::goodVerified=<',goodVerified,'>');
  if(goodCreated && goodVerified) {
    chain.push(msg);
  }
};

chain.onKnowBlock = (block) => {
  console.log('chain.onKnowBlock::block=<',block,'>');
}
