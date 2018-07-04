const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');


let dbTodo = level(dbBlockPathTodo);
let dbDone = level(dbBlockPathDone);

function readDB2Array(path,out,cb) {
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
  readDB2Array(dbTodo,gToDoCidList,onReadTodoFinnish);
},1);

function onReadTodoFinnish(){
  //console.log('onReadDoneFinnish gToDoCidList=<',gToDoCidList,'>');
  readDB2Array(dbDone,gDoneCidList,onReadDoneFinnish);
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
    delete gToDoCidList[kDone];
  }
}

function onDispatchTodo(to) {
  let keys = Object.keys(gToDoCidList);
  if(keys.length > 0) {
    let keyCID = keys[0];
    console.log('onDispatchTodo keyCID=<',keyCID,'>');
    sendTask(keyCID,to);
  }
}

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5003');
const CHANNEL  = require('./channel.js');

const WoWa  = require('./wo_wa_self.js');
let myWoWa = new WoWa('./wowaself.dat');

const WoWaP2P  = require('./wo_wa_p2p.js');
let p2p = new WoWaP2P();

p2p.onReady = () => {
  //onDispatchTodo();
  p2p.in(CHANNEL.TASK.WANT,onWantTask);
  p2p.in(CHANNEL.TASK.CATCH,onCatchTask);
  p2p.in(CHANNEL.TASK.DONE,onDoneTask);
}
p2p.onJoint = (peer) => {
  console.log('p2p.onJoint peer=<',peer,'>');
}

onWantTask = (msg,from) => {
  console.log('onWantTask msg=<',msg,'>');
  console.log('onWantTask from=<',from,'>');
  onDispatchTodo(from);
}

onCatchTask = (msg) => {
  console.log('onCatchTask msg=<',msg,'>');
  if(msg && msg.cid) {
    let cid = msg.cid;
    if(gToDoCidList[cid]) {
      delete gToDoCidList[cid];
    }
    gDoingCidList[cid] = msg.catch;
  }
};


onDoneTask = (msg,from) => {
  console.log('onDoneTask msg=<',msg,'>');
  console.log('onDoneTask from=<',from,'>');
  let input = msg.input;
  console.log('onDoneTask input=<',input,'>');
  if(gDoingCidList[input]) {
    delete gDoingCidList[input];
  }
  let output = msg.output;
  console.log('onDoneTask output=<',output,'>');
  gDoneCidList[input] = output;
  dbDone.put(input, output);
}


function broadCastTask(cid) {
  let sign = myWoWa.signTask(cid);
  let taskObj = {
    cid:cid,
    create:sign
  };
  p2p.out(CHANNEL.TASK.CREATE,taskObj);
}

function sendTask(cid,to) {
  let sign = myWoWa.signTask(cid);
  let taskObj = {
    cid:cid,
    create:sign
  };
  p2p.out(CHANNEL.TASK.CREATE,taskObj,to);
}


