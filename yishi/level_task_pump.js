const dbBlockPathTodo = '/watorvapor/wai.storage/crystal.wator/cnwiki/todo/block';
const dbBlockPathDoing = '/watorvapor/wai.storage/crystal.wator/cnwiki/doing/block';
const dbBlockPathDone = '/watorvapor/wai.storage/crystal.wator/cnwiki/done/block';
const level = require('level');


module.exports = class LevelTaskPump {
  constructor() {
    this.dbTodo = level(dbBlockPathTodo);
    this.dbTodo.on('open',function (evt) {
      console.log('constructor: dbTodo evt=<',evt,'>');
    })
    this.dbDoing = level(dbBlockPathDoing);
    this.dbDoing.on('open',function (evt) {
      console.log('constructor: dbDoing evt=<',evt,'>');
    })
    this.dbDone = level(dbBlockPathDone);
    this.dbDone.on('open',function (evt) {
      console.log('constructor:dbDone evt=<',evt,'>');
    })
  }
  fetchOne(onTodoBlock) {
    if(this.dbTodo.isClosed()) {
      this.dbTodo.open();
    }
    if(this.dbDoing.isClosed()) {
      this.dbDoing.open();
    }
    let stream = this.dbTodo.createReadStream();
    let self = this;
    //console.log('stream=<',stream,'>');
    stream.on('data', function (data) {
      //console.log('data.key=<',data.key.toString('utf-8'),'>');
      //console.log('data.value=<',data.value.toString('utf-8'),'>');
      let blockCid = data.key.toString('utf-8');
      stream.pause();
      setTimeout(function(){
        self.writeOneOut_(blockCid,onTodoBlock);
      },1);
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
  
  saveDone(cid,context) {
    if(this.dbDone.isClosed()) {
      this.dbDone.open();
    }
    let self = this;
    this.dbDone.put(cid,context,function(err){
      self.dbDone.close();
    });
    if(this.dbDoing.isClosed()) {
      this.dbDoing.open();
    }
    this.dbDoing.del(cid,function(err){
      if(err) {
        throw err;
      }
      self.dbDoing.close();
    });
  }
  
  writeOneOut_(blockCid,onTodoBlock){
    let self = this;
    console.log('writeOneOut_::this.dbDoing.isOpen()=<',this.dbDoing.isOpen(),'>');
    this.dbDoing.put(blockCid,'',function(err){
      if(err) {
        throw err;
      }
      onTodoBlock(blockCid);
      self.dbDoing.close();
    });
    this.dbTodo.del(blockCid,function(err){
      if(err) {
        throw err;
      }
      self.dbTodo.close();
    });
  }
}
  
