let uri = "ws://127.0.0.1:18020";
//let uri = "ws://192.168.100.200:18020";
let ws = new WebSocket(uri);
ws.onopen = onOpen;
ws.onmessage = onMessage;
ws.onclose = onClose;
ws.onerror = onError;
function onOpen(evt) {
  console.log('onOpen::evt=<',evt,'>');
  setTimeout(function(){
    readAddress();
  },1);
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
  let listBindDevice = new Vue({
    el: '#address-list',
    data: { allAddress: addresses }
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
