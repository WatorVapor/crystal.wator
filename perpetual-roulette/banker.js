/*
const RouletteP2P = require('../p2p/roulette_p2p');
//console.log('RouletteP2P=<',RouletteP2P,'>');

let bDealerReady = false;
let bPlayerReady = false;
let bStorageReady = false;
const iConstFirstBlockDelay = 1000 * 20;

const DEAL_WORLD_MESSAGE = '三十年河东，三十年河西，风水轮流转';
const p2pDealer = new RouletteP2P(DEAL_WORLD_MESSAGE);
//console.log('p2pDealer=<',p2pDealer,'>');
p2pDealer.onReady = () => {
  bDealerReady = true;
  if(bDealerReady && bPlayerReady && bStorageReady) {
    setTimeout(onReadTopBlock,iConstFirstBlockDelay);
  }
}

const PLAY_WORLD_MESSAGE = '等的我花都凉了';
const p2pPlay = new RouletteP2P(PLAY_WORLD_MESSAGE);
//console.log('p2pPlay=<',p2pPlay,'>');
p2pPlay.onReady = () => {
  bPlayerReady = true;
  if(bDealerReady && bPlayerReady && bStorageReady) {
    setTimeout(onReadTopBlock,iConstFirstBlockDelay);
  }
}

const SHA3  = require('sha3');
const IPFS = require('ipfs');
const bs58 = require('bs58')

let dBankTag = new SHA3.SHA3Hash(224);
dBankTag.update(DEAL_WORLD_MESSAGE);
let buffBankTag = Buffer.from(dBankTag.digest('hex'),'hex');
const storageRepos = bs58.encode(buffBankTag);
console.log('storageRepos=<',storageRepos,'>');


const execSync = require('child_process').execSync;
const REPO_PREFIX = '.ipfs_pubsub_room_data/';
execSync('mkdir -p ' + REPO_PREFIX);

const IPFS_CONF = {
  repo: REPO_PREFIX + storageRepos
};
let ipfs = new IPFS(IPFS_CONF);
ipfs.on('ready', () => {
  bStorageReady = true;
  if(bDealerReady && bPlayerReady && bStorageReady) {
    setTimeout(onReadTopBlock,iConstFirstBlockDelay);
  }
});
*/

const Chair = require('./round-table').Chair;
//console.log('Chair=<',Chair,'>');
let chair = new Chair();
chair.onReady = (node) => {
  //console.log('chair=<',chair,'>');
  onReadTopBlock(node);
}


let gTopBlockCID = 'QmaQiuGocvEsf7WwpG5Kt9d6J44V7TjfGy1GbZ3BKDgwyt';
const iConstBlockDealDelay = 1000 * 10;
onReadTopBlock = async (node) => {
  //console.log('onReadTopBlock node=<',node,'>');
  //console.log('onReadTopBlock blockIpfs=<',blockIpfs,'>');
  try {
    let blockIpfs = await node.get(gTopBlockCID);
    if(blockIpfs.length > 0) {
      let block = JSON.parse(blockIpfs[0].content);
      //console.log('onReadTopBlock block=<',block,'>');
      let prev = block.prev;
      console.log('onReadTopBlock prev=<',prev,'>');
      gTopBlockCID = prev;
      let card = {cid : gTopBlockCID};
      chair.publish(card);
      setTimeout(()=>{
        onReadTopBlock(node);
      },iConstBlockDealDelay);
    }
  } catch(e) {
    console.log('onReadTopBlock e=<',e,'>');
  }
};

