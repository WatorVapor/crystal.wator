const WoWaP2p = require('../p2p/wo_wa_p2p');
//console.log('WoWaP2p=<',WoWaP2p,'>');
const WORLD_MESSAGE = '三十年河东，三十年河西，风水轮流转';
const p2p = new WoWaP2p(WORLD_MESSAGE);
//console.log('p2p=<',p2p,'>');

let bPubSubReady = false;
let bStorageReady = false;
p2p.onReady = () => {
  bPubSubReady = true;
  if(bPubSubReady && bStorageReady) {
    setTimeout(onReadTopBlock,1);
  }
}

const SHA3  = require('sha3');
const IPFS = require('ipfs');
const bs58 = require('bs58')

let dBankTag = new SHA3.SHA3Hash(224);
dBankTag.update(WORLD_MESSAGE);
let buffBankTag = Buffer.from(dBankTag.digest('hex'),'hex');
const storageRepos = bs58.encode(buffBankTag);
console.log('storageRepos=<',storageRepos,'>');



const IPFS_CONF = {
  repo: '.ipfs_pubsub_room_data_/' + storageRepos
};
let ipfs = new IPFS(IPFS_CONF);
ipfs.on('ready', () => {
  bStorageReady = true;
  if(bPubSubReady && bStorageReady) {
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
      p2p.out(gTopBlockCID);
    }
  } catch(e) {
    console.log('onReadTopBlock e=<',e,'>');
  }
};

