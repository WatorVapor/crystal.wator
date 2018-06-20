const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDoing = '/watorvapor/wai.storage/crystal.wator/cnwiki/doing/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');



function readDB2Array(path,out,cb) {
  let db = level(path);
  let stream = db.createReadStream();

  stream.on('data', function (data) {
    //console.log('data.key=<',data.key.toString('utf-8'),'>');
    //console.log('data.value=<',data.value.toString('utf-8'),'>');
    let blockCid = data.key.toString('utf-8');
    stream.pause();
    if(blockCid.startsWith('Qm')){
      out[blockCid] = -1;
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
  readDB2Array(dbBlockPathDoing,gDoingCidList,onReadDoingFinnish);
}

function onReadDoingFinnish(){
  console.log('onReadDoneFinnish gDoingCidList=<',gDoingCidList,'>');
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
  }  
  console.log('runDispatchTask gDoneCidList=<',gDoneCidList,'>');
  for(let kDone of Object.keys(gDoneCidList)) {
    console.log('runDispatchTask kDone=<',kDone,'>');
  }  
}
