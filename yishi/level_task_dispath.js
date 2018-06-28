const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');



function readDB2Array(path,out,cb) {
  let db = level(path);
  let stream = db.createReadStream();
  let ts = new Date();

  stream.on('data', function (data) {
    //console.log('data.key=<',data.key.toString('utf-8'),'>');
    //console.log('data.value=<',data.value.toString('utf-8'),'>');
    let blockCid = data.key.toString('utf-8');
    stream.pause();
    if(blockCid.startsWith('Qm')){
      out[blockCid] = ts.toUTCString();
    }
    stream.resume();  
  });
  stream.on('error', function (err) {
    console.log('Oh my!', err);
  });
  stream.on('close', function () {
    console.log('streamTodo closed');
  });
  stream.on('end', function () {
    console.log('stream ended');
    //console.log('stream ended out=<',out,'>');
    if(typeof cb === 'function') {
      cb();
    }
  });
}

let gToDoCidList = {};
let gDoingCidList = {};
let gDoneCidList = {};

setTimeout(function(){
  readDB2Array(dbBlockPathTodo,gToDoCidList,onReadTodoFinnish);
},1);

function onReadTodoFinnish(){
  console.log('onReadDoneFinnish gToDoCidList=<',gToDoCidList,'>');
  readDB2Array(dbBlockPathDone,gDoneCidList,onReadDoneFinnish);
}

function onReadDoneFinnish(){
  console.log('onReadDoneFinnish gDoneCidList=<',gDoneCidList,'>');
  setTimeout(runDispatchTask,0);
}

function runDispatchTask() {
  console.log('runDispatchTask gDoingCidList=<',gDoingCidList,'>');
  for(let kDoing of Object.keys(gDoingCidList)) {
    console.log('runDispatchTask kDoing=<',kDoing,'>');
    delete gToDoCidList[kDoing];
  }  
  console.log('runDispatchTask gDoneCidList=<',gDoneCidList,'>');
  for(let kDone of Object.keys(gDoneCidList)) {
    console.log('runDispatchTask kDone=<',kDone,'>');
    delete gToDoCidList[kDoing];
  }
  
  setTimeout(onDispatchTodo,1);
}

function onDispatchTodo() {
  let keys = Object.keys(gToDoCidList);
  if(keys.length > 0) {
    let keyCID = keys[0];
    console.log('onDispatchTodo keyCID=<',keyCID,'>');
    broadCastNewTask(keyCID);
  }
}

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

const ipfsPubTopicNewTask = 'wai-ipfs-yishi-new-task';
const ipfsSubTopicCatchTask = 'wai-ipfs-yishi-catch-task';

const onRcvIpfsCatchTask = (msg) => {
  console.log('onRcvIpfsCatchTask msg=<',msg,'>');
  console.log('onRcvIpfsCatchTask msg=<',msg.data.toString('utf8'),'>');
  let msgJson = JSON.parse(msg.data.toString('utf8'));
  console.log('broadCastCathTask::msgJson=<',msgJson,'>');
  //console.trace();
}
ipfs.pubsub.subscribe(ipfsSubTopicCatchTask, onRcvIpfsCatchTask,(err) => {
  if (err) {
    throw err
  }
  console.log('subscribe ipfs ipfsSubTopicCatchTask=<',ipfsSubTopicCatchTask,'>');
});

ipfs.pubsub.peers(ipfsSubTopicCatchTask, (err, peerIds) => {
  if (err) {
    return console.error(`failed to get peers subscribed to ${ipfsSubTopicCatchTask}`, err)
  }
  console.log(peerIds)
})


const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');


function broadCastNewTask(cid) {
  let sign = myWoWa.signNewTask(cid);
  let taskObj = {
    cid:cid,
    sign:sign
  };
  
  const msgBuff = Buffer.from(JSON.stringify(taskObj));
  ipfs.pubsub.publish(ipfsPubTopicNewTask, msgBuff, (err) => {
    if (err) {
      throw err;
    }
    console.log('broadCastNewTask ipfs msgBuff=<',msgBuff,'>');
  });
}

