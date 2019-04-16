const RouletteP2P = require('../p2p/roulette_p2p');
//console.log('RouletteP2P=<',RouletteP2P,'>');

const DEAL_WORLD_MESSAGE = '三十年河东，三十年河西，风水轮流转';
const PLAY_WORLD_MESSAGE = '等的我花都凉了';
const iConstFirstBlockDelay = 1000 * 1;



const execSync = require('child_process').execSync;
const REPO_PREFIX = '.ipfs_storage_data/';
execSync('mkdir -p ' + REPO_PREFIX);



class RouletteTable {
  constructor(position) {
    if(position !== 'chair' && position !== 'seat' ) {
      console.errer('RouletteTable::constructor position=<',position,'> is not supported');
      return;
    }
    this.position = position;
    this.bDealerReady = false;
    this.bPlayerReady = false;
    this.p2pDealer = new RouletteP2P(DEAL_WORLD_MESSAGE);
    //console.log('p2pDealer=<',p2pDealer,'>');
    let self = this;
    this.p2pDealer.onReady = () => {
      self.bDealerReady = true;
      console.log('RouletteTable self.bDealerReady =<',self.bDealerReady,'>');
      self.tryCallReadyCallBack_();
    }
    this.p2pPlayer = new RouletteP2P(PLAY_WORLD_MESSAGE);
    //console.log('p2pPlayer=<',p2pPlayer,'>');
    this.p2pPlayer.onReady = () => {
      self.bPlayerReady = true;
      console.log('RouletteTable self.bPlayerReady =<',self.bPlayerReady,'>');
      self.tryCallReadyCallBack_();
    }
  }
  
  tryCallReadyCallBack_() {
    console.log('RouletteTable this.bDealerReady =<',this.bDealerReady,'>');
    console.log('RouletteTable this.bPlayerReady =<',this.bPlayerReady,'>');
    if(this.bDealerReady && this.bPlayerReady) {
      if(typeof this.onReady === 'function') {
        let self = this;
        if(this.position === 'chair') {
          setTimeout(()=> {
            self.onReady();
          },iConstFirstBlockDelay);
        } else {
          setTimeout(()=> {
            self.onReady();
          },0);
        }
      }
    }
  }
}

class RouletteChair extends RouletteTable {
  constructor() {
    super('chair');
  }
  publish(msgObj) {
    this.p2pDealer.publish(msgObj);    
  }
  subscribe(cb) {
    this.p2pPlayer.subscribe(cb);
  }
}
class RouletteSeat extends RouletteTable {
  constructor() {
    super('seat');
  }
  publish(msgObj) {
    this.p2pPlayer.publish(msgObj);    
  }
  subscribe(cb) {
    this.p2pDealer.subscribe(cb);
  }
}


module.exports = {
  Chair:RouletteChair,
  Seat:RouletteSeat
};



