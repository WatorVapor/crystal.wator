const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDoing = '/watorvapor/wai.storage/crystal.wator/cnwiki/doing/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');

let dbTodo = level(dbBlockPathTodo);
let stream = dbTodo.createReadStream();

let gToDoCidList = [];

stream.on('data', function (data) {
  //console.log('data.key=<',data.key.toString('utf-8'),'>');
  //console.log('data.value=<',data.value.toString('utf-8'),'>');
  let blockCid = data.key.toString('utf-8');
  stream.pause();
  gToDoCidList.push(blockCid);
  stream.resume();  
});
stream.on('error', function (err) {
  console.log('Oh my!', err);
});
stream.on('close', function () {
  console.log('Stream closed');
});
stream.on('end', function () {
  console.log('Stream ended');
  console.log('Stream ended gToDoCidList=<',gToDoCidList,'>');
});

