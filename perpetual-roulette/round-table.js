const RouletteP2P = require('../p2p/roulette_p2p');
//console.log('RouletteP2P=<',RouletteP2P,'>');

const DEAL_WORLD_MESSAGE = '三十年河东，三十年河西，风水轮流转';
const PLAY_WORLD_MESSAGE = '等的我花都凉了';
const iConstFirstBlockDelay = 1000 * 20;

const SHA3  = require('sha3');
const IPFS = require('ipfs');
const bs58 = require('bs58')



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
    this.bStorageReady = false;
    this.p2pDealer = new RouletteP2P(DEAL_WORLD_MESSAGE);
    //console.log('p2pDealer=<',p2pDealer,'>');
    let self = this;
    this.p2pDealer.onReady = () => {
      self.bDealerReady = true;
      if(self.bDealerReady && self.bPlayerReady && self.bStorageReady) {
        if(typeof self.onReady === 'function') {
          if(self.position === 'chair') {
            setTimeout(self.onReady,iConstFirstBlockDelay);
          } else {
            setTimeout(self.onReady,0);            
          }
        }
      }
    }
    this.p2pPlayer = new RouletteP2P(PLAY_WORLD_MESSAGE);
    //console.log('p2pPlayer=<',p2pPlayer,'>');
    this.p2pPlayer.onReady = () => {
      self.bPlayerReady = true;
      if(self.bDealerReady && self.bPlayerReady && self.bStorageReady) {
        if(typeof self.onReady === 'function') {
          if(self.position === 'chair') {
            setTimeout(self.onReady,iConstFirstBlockDelay);
          } else {
            setTimeout(self.onReady,0);            
          }
        }
      }
    }

    const dStorageTag = new SHA3.SHA3Hash(224);
    if(this.position === 'chair') {
      dStorageTag.update(DEAL_WORLD_MESSAGE);
    } else {
      dStorageTag.update(PLAY_WORLD_MESSAGE);      
    }
    let buffStorageTag = Buffer.from(dStorageTag.digest('hex'),'hex');
    const storageRepos = bs58.encode(buffStorageTag);
    console.log('storageRepos=<',storageRepos,'>');    
    
    const IPFS_CONF = {
      repo: REPO_PREFIX + storageRepos,
      Addresses: {
        Swarm: [
          '/ip6/::/tcp/4012'
        ],
        API: '/ip4/127.0.0.1/tcp/5012',
        Gateway: '/ip4/127.0.0.1/tcp/9190'
      }      
    };
    if(this.position === 'chair') {
      IPFS_CONF.Addresses = {
        Swarm: [
          '/ip6/::/tcp/4013'
        ],
        API: '/ip4/127.0.0.1/tcp/5013',
        Gateway: '/ip4/127.0.0.1/tcp/9191'
      };
    }

    this.ipfs = new IPFS(IPFS_CONF);
    this.ipfs.on('ready', () => {
      self.bStorageReady = true;
      if(self.bDealerReady && self.bPlayerReady && self.bStorageReady) {
        if(typeof self.onReady === 'function') {
          if(self.position === 'chair') {
            setTimeout(self.onReady,iConstFirstBlockDelay);
          } else {
            setTimeout(self.onReady,0);            
          }
        }
      }
    });
    this.ipfs.on('error', error => {
      console.error('error.message=<',error.message,'>');    
    })
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



