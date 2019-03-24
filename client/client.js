//const uri = "ws://127.0.0.1:18020";
const uri = "ws://node4.ceph.wator.xyz:18020";
const ws = new WebSocket(uri);
ws.onopen = onOpen;
ws.onmessage = onMessage;
ws.onclose = onClose;
ws.onerror = onError;


function onOpen(evt) {
  console.log('onOpen::evt=<',evt,'>');
  setTimeout(function(){
    readAddress();
  },0);
  setTimeout(function(){
    readBlance();
  },0);
  setTimeout(function(){
    readTransaction();
  },0);  
}

function onMessage(evt) {
  console.log('onMessage::evt=<',evt,'>');
  let msgJson = JSON.parse(evt.data);
  console.log('onMessage::msgJson=<',msgJson,'>');
  if(msgJson) {
    if(msgJson.response) {
      if(msgJson.response === 'address') {
        onReadAddress(msgJson.address);
      }
      if(msgJson.response === 'blance') {
        onReadBlance(msgJson.blance);
      }
      if(msgJson.response === 'transaction') {
        onReadTransaction(msgJson.transaction);
      }
    }
  }
}

function onClose(evt) {
  console.log('onClose::evt=<',evt,'>');
}

function onError(evt) {
  console.log('onError::evt=<',evt,'>');
} 

function readAddress(evt) {
  console.log('readAddress::evt=<',evt,'>');

  let api = {
    request:'address'
  };
  ws.send(JSON.stringify(api));
}

function onReadAddress(addresses) {
  console.log('onReadAddress::addresses=<',addresses,'>');
  let listAddredd = new Vue({
    el: '#wc-body-recieve-address-list',
    data: { allAddress: addresses }
  })
}  


function readBlance(evt) {
  console.log('readBlance::evt=<',evt,'>');

  let api = {
    request:'blance'
  };
  ws.send(JSON.stringify(api));
}

function onReadBlance(blance) {
  console.log('onReadBlance::blance=<',blance,'>');
  let listSummary = new Vue({
    el: '#wc-body-card-summary',
    data: { blance: blance }
  })
}  

function readTransaction(evt) {
  console.log('readTransaction::evt=<',evt,'>');

  let api = {
    request:'transaction'
  };
  ws.send(JSON.stringify(api));
}

function onReadTransaction(transaction) {
  console.log('onReadTransaction::transaction=<',transaction,'>');
  let listSummary = new Vue({
    el: '#wc-body-card-history-summary',
    data: { transactionRecent: transaction }
  })
}  



function onClickCreateAddress(elem) {
  console.log('onClickCreateAddress::elem=<',elem,'>');
  let message = elem.parentNode.parentNode.getElementsByTagName('input')[0].value || '';
  console.log('onClickCreateAddress::message=<',message,'>');
  let api = {
    request:'createAddress',
    comment:message
  };
  ws.send(JSON.stringify(api));
}
