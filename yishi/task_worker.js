const redis = require("redis");
const redisPubChannel = 'wai.relay.ipfs.to.redis';
const redisSubChannel = 'wai.relay.redis.to.ipfs';

module.exports = class TaskWorker {
  constructor() {
    this.pub = redis.createClient();
    this.pub.on("ready", (err) => {
      if(err) {
        throw err;
      }
    });
    this.sub = redis.createClient();
    let self = this;
    this.sub.on("ready", (err) => {
      if(err) {
        throw err;
      }
      self.sub.subscribe(redisSubChannel);
    });
    this.sub.on("message", (channel, msg) => {
      self._onMessage(channel, msg);
    });
    this._oneBlockWords = {};
  }
  out(cid) {
    let taskJson = {block:cid,task:'wator.ipfs.ostrich.app'};
    this.pub.publish(redisPubChannel,JSON.stringify(taskJson));
  }
  
  _onMessage(channel, msg) {
    //console.log('subRedis.on channel=<',channel,'>');
    //console.log('subRedis.on msg=<',msg,'>');
    let jsonMsg = JSON.parse(msg);
    if(jsonMsg) {
      //console.log('subRedis.on jsonMsg=<',jsonMsg,'>');
      if(jsonMsg.word) {
        this._collectWords(jsonMsg.word);
      } else {
        //console.log('subRedis.on jsonMsg=<',jsonMsg,'>');
        if(typeof this.onReadyOneBlock === 'function') {
          this.onReadyOneBlock(jsonMsg,this._oneBlockWords);
          this._oneBlockWords = {};
        }
      }
    }
  }
  _collectWords(words) {
    //console.log('collectWords words=<',words,'>');
    for(let i = 0;i < words.length ; i++) {
      let wordRank = words[i];
      //console.log('collectWords wordRank=<',wordRank,'>');
      let keys = Object.keys(wordRank);
      //console.log('collectWords keys=<',keys,'>');
      let word = keys[0];
      if(this._oneBlockWords[word]) {
        this._oneBlockWords[word] += wordRank[word];
        //console.log('collectWords oneBlockWors[word]=<',oneBlockWors[word],'>');
      } else {
        this._oneBlockWords[word] = wordRank[word];
      }
    }
  }
}

