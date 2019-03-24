const RouletteP2p = require('../p2p/roulette_p2p');
//console.log('RouletteP2p=<',RouletteP2p,'>');

let bDealReady = false;
let bPlayReady = false;
let bStorageReady = false;


const DEAL_WORLD_MESSAGE = '三十年河东，三十年河西，风水轮流转';
const p2pDeal = new RouletteP2p(DEAL_WORLD_MESSAGE);
//console.log('p2pDeal=<',p2pDeal,'>');
p2pDeal.onReady = () => {
  bDealReady = true;
  if(bDealReady && bPlayReady && bStorageReady) {
    setTimeout(onReadTopBlock,1);
  }
}

const PLAY_WORLD_MESSAGE = '等的我花都凉了';
const p2pPlay = new RouletteP2p(PLAY_WORLD_MESSAGE);
//console.log('p2pPlay=<',p2pPlay,'>');
p2pPlay.onReady = () => {
  bPlayReady = true;
  if(bDealReady && bPlayReady && bStorageReady) {
    setTimeout(onReadTopBlock,1);
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



const IPFS_CONF = {
  repo: '.ipfs_pubsub_room_data_' + storageRepos
};
let ipfs = new IPFS(IPFS_CONF);
ipfs.on('ready', () => {
  bStorageReady = true;
  if(bDealReady && bPlayReady && bStorageReady) {
    setTimeout(onReadTopBlock,1);
  }
});

let gTopBlockCID = 'QmaQiuGocvEsf7WwpG5Kt9d6J44V7TjfGy1GbZ3BKDgwyt';

onReadTopBlock = async () => {
  //console.log('onReadTopBlock ipfs=<',ipfs,'>');
  //console.log('onReadTopBlock blockIpfs=<',blockIpfs,'>');
  try {
    let blockIpfs = await ipfs.get(gTopBlockCID);
    if(blockIpfs.length > 0) {
      let block = JSON.parse(blockIpfs[0].content);
      //console.log('onReadTopBlock block=<',block,'>');
      let prev = block.prev;
      console.log('onReadTopBlock prev=<',prev,'>');
      gTopBlockCID = prev;
      let card = {cid : gTopBlockCID};
      p2pDeal.out(card);
    }
  } catch(e) {
    console.log('onReadTopBlock e=<',e,'>');
  }
};

