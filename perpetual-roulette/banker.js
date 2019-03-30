const Chair = require('./round-table').Chair;
//console.log('Chair=<',Chair,'>');
let chair = new Chair();
chair.onReady = (node) => {
  //console.log('chair=<',chair,'>');
  onReadTopBlock(node);
}

const iConstBlockDealDelay = 1000 * 30;

let gTopBlockCID = 'QmaQiuGocvEsf7WwpG5Kt9d6J44V7TjfGy1GbZ3BKDgwyt';
let gRecentPublished = '';
onReadTopBlock = async (node) => {
  //console.log('onReadTopBlock node=<',node,'>');
  //console.log('onReadTopBlock blockIpfs=<',blockIpfs,'>');
  try {
    let blockIpfs = await node.get(gTopBlockCID);
    if(blockIpfs.length > 0) {
      let block = JSON.parse(blockIpfs[0].content);
      //console.log('onReadTopBlock block=<',block,'>');
      let prev = block.prev;
      //console.log('onReadTopBlock prev=<',prev,'>');
      gTopBlockCID = prev;
      if(gRecentPublished !==  gTopBlockCID) {
        let card = {cid : gTopBlockCID};
        console.log('onReadTopBlock card=<',card,'>');
        chair.publish(card);
        gRecentPublished = gTopBlockCID;
      } else {
        console.log('onReadTopBlock sent!! ??? prev=<',prev,'>');
      }
      setTimeout(()=>{
        onReadTopBlock(node);
      },iConstBlockDealDelay);
    }
  } catch(e) {
    console.log('onReadTopBlock e=<',e,'>');
  }
};

