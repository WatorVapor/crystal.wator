/*
const RouletteP2P = require('../p2p/roulette_p2p');
//console.log('RouletteP2P=<',RouletteP2P,'>');


const DEAL_WORLD_MESSAGE = '三十年河东，三十年河西，风水轮流转';
const p2pDeal = new RouletteP2P(DEAL_WORLD_MESSAGE);
//console.log('p2pDeal=<',p2pDeal,'>');
p2pDeal.onReady = () => {
  //console.log('p2pDeal=<',p2pDeal,'>');
}

const PLAY_WORLD_MESSAGE = '等的我花都凉了';
const p2pPlay = new RouletteP2P(PLAY_WORLD_MESSAGE);
//console.log('p2pPlay=<',p2pPlay,'>');
p2pPlay.onReady = () => {
  //console.log('p2pPlay=<',p2pPlay,'>');
}

p2pDeal.in((msg,from)=> {
  onDealMsg(msg,from);
});

onDealMsg = (msg,from) => {
  console.log('onDealMsg::msg=<',msg,'>');
  console.log('onDealMsg::from=<',from,'>');
}
*/
const Seat = require('./round-table').Seat;
//console.log('Seat=<',Seat,'>');
let seat = new Seat();
seat.onReady = () => {
  //console.log('seat=<',seat,'>');
}
seat.subscribe((msg,from)=> {
  onDealMsg(msg,from);
});

onDealMsg = (msg,from) => {
  console.log('onDealMsg::msg=<',msg,'>');
  console.log('onDealMsg::from=<',from,'>');
}
