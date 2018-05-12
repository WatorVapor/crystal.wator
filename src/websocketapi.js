const WebSocket = require('ws');
/*
const wsConfig = {
  host:'127.0.0.1',
  port: 18020
};
*/


const wsConfig = {
  port: 18020
};

module.exports = class wsAPI {
  constructor(wallet) {
    this.wallet = wallet;
    this.wss = new WebSocket.Server(wsConfig);
    let self = this;
    this.wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        self.onMessage_(ws,message);
      });
    });    
  }
  
  onMessage_(ws,message) {
    console.log('onMessage_::message=<',message,'>');
    let msgJson = JSON.parse(message);
    console.log('onMessage_::msgJson=<',msgJson,'>');
    if(msgJson) {
      if(msgJson.request) {
        if(msgJson.request === 'address') {
          this.onRequestAddress_(ws);
        }
      }
    }
  }
  
  onRequestAddress_(ws) {
    let address = this.wallet.getAddress();
    console.log('onRequestAddress_::address=<',address,'>');
    let res = {
      response:'address',
      address:address
    }
    ws.send(JSON.stringify(res));
  }
  
}
