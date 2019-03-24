const RouletteP2p = require('../p2p/roulette_p2p');
//console.log('RouletteP2p=<',RouletteP2p,'>');


const DEAL_WORLD_MESSAGE = '三十年河东，三十年河西，风水轮流转';
const p2pDeal = new RouletteP2p(DEAL_WORLD_MESSAGE);
//console.log('p2pDeal=<',p2pDeal,'>');
p2pDeal.onReady = () => {
  //console.log('p2pDeal=<',p2pDeal,'>');
}

const PLAY_WORLD_MESSAGE = '等的我花都凉了';
const p2pPlay = new RouletteP2p(PLAY_WORLD_MESSAGE);
//console.log('p2pPlay=<',p2pPlay,'>');
p2pPlay.onReady = () => {
  //console.log('p2pPlay=<',p2pPlay,'>');
}

p2pDeal.in(()=> {
  onDealMsg();
});

onDealMsg = (msg) => {
  console.log('onDealMsg::msg=<',msg,'>');
}