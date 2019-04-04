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

shake256('Message to hash', 512);
