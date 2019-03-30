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
  broadCastWS(msg);
}

const WebSocket = require('ws');
const server = WebSocket.Server;
const options = {
  host:'127.0.0.1',
  port: 8051
};
const wss = new server(options);


onWSConnected = (ws) => {
  //console.log('onWSConnected::ws=<',ws,'>');
  ws.on("message", onWSMessage);  
}
wss.on("connection", onWSConnected);

onWSMessage = (msg)  => {
  console.log('onWSMessage::msg=<',msg,'>');
}

broadCastWS = (msg) => {
  console.log('broadCastWS::msg=<',msg,'>');
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}

