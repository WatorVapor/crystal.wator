const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDoing = '/watorvapor/wai.storage/crystal.wator/cnwiki/doing/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');

let gToDoCidList = [];
let gDoingCidList = [];
let gDoneCidList = [];


function readDB2Array(path,out,cb) {
  let db = level(path);
  let stream = db.createReadStream();

  stream.on('data', function (data) {
    //console.log('data.key=<',data.key.toString('utf-8'),'>');
    //console.log('data.value=<',data.value.toString('utf-8'),'>');
    let blockCid = data.key.toString('utf-8');
    stream.pause();
    out.push(blockCid);
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
    console.log('stream ended out=<',out,'>');
  });
}

setTimeout(function(){
  readDB2Array(dbBlockPathTodo,gToDoCidList,onReadTodoFinnish);
},1);

function onReadTodoFinnish(){
  console.log('onReadDoneFinnish gToDoCidList=<',gToDoCidList,'>');
  readDB2Array(dbBlockPathDoing,gToDoCidList,onReadDoingFinnish);
}

function onReadDoingFinnish(){
  console.log('onReadDoneFinnish gDoingCidList=<',gDoingCidList,'>');
  readDB2Array(dbBlockPathDone,gToDoCidList,onReadDoneFinnish);
}

function onReadDoneFinnish(){
  console.log('onReadDoneFinnish gDoneCidList=<',gDoneCidList,'>');
}


