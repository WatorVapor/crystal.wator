const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');
let dbTodo = level(dbBlockPathTodo);
let dbDone = level(dbBlockPathDone);
let stream = dbTodo.createReadStream();
//console.log('stream=<',stream,'>');
stream.on('data', function (data) {
  //console.log('data.key=<',data.key.toString('utf-8'),'>');
  //console.log('data.value=<',data.value.toString('utf-8'),'>');
  stream.pause();
  let blockCid = data.key.toString('utf-8');
  dbDone.get(blockCid, function (err, value) {
    if (err) {
      if (err.notFound) {
        console.log('blockCid=<',blockCid,'>');
        let taskJson = {block:blockCid,task:'wator.ipfs.ostrich.app'};
        pubRedis.publish(redisPubChannel,JSON.stringify(taskJson));
      } else {
        throw err;
      }
    } else {
      console.log('dbDone blockCid=<',blockCid,'>');
      stream.resume();
    }
  });
});

stream.on('error', function (err) {
  console.log('Oh my!', err);
});
stream.on('close', function () {
  console.log('Stream closed');
});
stream.on('end', function () {
  console.log('Stream ended');
  writeBlock();
});

function saveDoneDB(result) {
  //console.log('saveDoneDB result=<',result,'>');
  dbDone.put(result.input,JSON.stringify(result));
}


