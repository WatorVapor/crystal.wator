const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDoing = '/watorvapor/wai.storage/crystal.wator/cnwiki/doing/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');

let dbTodo = level(dbBlockPathTodo);
let streamTodo = dbTodo.createReadStream();

let gToDoCidList = [];
streamTodo.on('data', function (data) {
  //console.log('data.key=<',data.key.toString('utf-8'),'>');
  //console.log('data.value=<',data.value.toString('utf-8'),'>');
  let blockCid = data.key.toString('utf-8');
  streamTodo.pause();
  gToDoCidList.push(blockCid);
  streamTodo.resume();  
});
streamTodo.on('error', function (err) {
  console.log('Oh my!', err);
});
streamTodo.on('close', function () {
  console.log('Stream closed');
});
streamTodo.on('end', function () {
  console.log('Stream ended');
  console.log('Stream ended gToDoCidList=<',gToDoCidList,'>');
});

let dbDoing = level(dbBlockPathDoing);
let streamDoing = dbDoing.createReadStream();

let gDoingCidList = [];
streamDoing.on('data', function (data) {
  //console.log('data.key=<',data.key.toString('utf-8'),'>');
  //console.log('data.value=<',data.value.toString('utf-8'),'>');
  let blockCid = data.key.toString('utf-8');
  streamDoing.pause();
  gDoingCidList.push(blockCid);
  streamDoing.resume();  
});
streamDoing.on('error', function (err) {
  console.log('Oh my!', err);
});
streamDoing.on('close', function () {
  console.log('Stream closed');
});
streamDoing.on('end', function () {
  console.log('Stream ended');
  console.log('Stream ended gDoingCidList=<',gDoingCidList,'>');
});

let dbDone = level(dbBlockPathDone);
let streamDone = dbDone.createReadStream();

let gDoneCidList = [];
streamDone.on('data', function (data) {
  //console.log('data.key=<',data.key.toString('utf-8'),'>');
  //console.log('data.value=<',data.value.toString('utf-8'),'>');
  let blockCid = data.key.toString('utf-8');
  streamDone.pause();
  gDoneCidList.push(blockCid);
  streamDone.resume();  
});
streamDone.on('error', function (err) {
  console.log('Oh my!', err);
});
streamDone.on('close', function () {
  console.log('Stream closed');
});
streamDone.on('end', function () {
  console.log('Stream ended');
  console.log('Stream ended gDoingCidList=<',gDoneCidList,'>');
});



