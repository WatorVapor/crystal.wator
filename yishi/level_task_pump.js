const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');


module.exports = class LevelTaskPump {
  constructor() {
    this.dbDone = level(dbBlockPathDone);
    this.dbDone.on('open',function (evt) {
      console.log('constructor:dbDone evt=<',evt,'>');
    })
    this.dbTodo = level(dbBlockPathTodo);
    this.dbTodo.on('open',function (evt) {
      console.log('constructor: dbTodo evt=<',evt,'>');
    })
  }
  fetchOne(onTodoBlock) {
    if(this.dbTodo.isClosed()) {
      this.dbTodo.open();
    }
    if(this.dbDone.isClosed()) {
      this.dbDone.open();
    }
    let stream = this.dbTodo.createReadStream();
    //console.log('stream=<',stream,'>');
    stream.on('data', function (data) {
      //console.log('data.key=<',data.key.toString('utf-8'),'>');
      //console.log('data.value=<',data.value.toString('utf-8'),'>');
      stream.pause();
      let blockCid = data.key.toString('utf-8');
      this.dbDone.get(blockCid, function (err, value) {
        if (err) {
          if (err.notFound) {
            console.log('blockCid=<',blockCid,'>');
            onTodoBlock(blockCid);
            this.dbDone.close();
            this.dbTodo.close();
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
    });
  }
  saveDone(result) {
    if(this.dbDone.isClosed()) {
      this.dbDone.open();
    }
    this.dbDone.put(result.input,JSON.stringify(result));
    this.dbDone.close();
  }
}
  
