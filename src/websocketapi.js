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
        if(msgJson.request === 'createAddress') {
          this.onRequestCreateAddress_(ws,msgJson.comment);
        }
        if(msgJson.request === 'blance') {
          this.onRequestReadBlance_(ws);
        }
        if(msgJson.request === 'transaction') {
          this.onRequestReadTransaction_(ws);
        }
      }
    }
  }
  
  onRequestAddress_(ws) {
    let address = this.wallet.getAllAddress();
    console.log('onRequestAddress_::address=<',address,'>');
    let res = {
      response:'address',
      address:address
    }
    ws.send(JSON.stringify(res));
  }

  onRequestCreateAddress_(ws,comment) {
    this.wallet.createAddress(comment);
    let address = this.wallet.getAllAddress();
    console.log('onRequestCreateAddress_::address=<',address,'>');
    let res = {
      response:'address',
      address:address
    }
    ws.send(JSON.stringify(res));
  }

  onRequestReadBlance_(ws) {
    let verifiedAmount = 0.0;
    let verifyingAmount = 0.0;
    let totalAmount = verifiedAmount + verifyingAmount;
    let res = {
      response:'blance',
      blance:{
        verified:verifiedAmount.toFixed(6),
        verifying:verifyingAmount.toFixed(6),
        total:totalAmount.toFixed(6)
      }
    }
    ws.send(JSON.stringify(res));
  }

  onRequestReadTransaction_(ws) {
    let amount = 0.0;
    let res = {
      response:'transaction',
      transaction:[
        {
          dir_icon:'add_circle',
          date:new Date(),
          message:'test +',
          amount:amount.toFixed(6)
        },
        {
          dir_icon:'remove_circle',
          date:new Date(),
          message:'test -',
          amount:amount.toFixed(6)
        }
      ]
    }
    ws.send(JSON.stringify(res));
  }
  
}
