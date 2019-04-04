const Hapi = require('hapi');
const fs = require('fs');

const server = Hapi.server({ 
    host: 'localhost', 
    port: 28080 
});

const ROOT_HASH_ACHIVE = '/watorvapor/wai.storage/hashArchive';

onRequestRoot = (request, h) => {
  //console.log('onRequest::request=<',request,'>');
  //console.log('onRequest::h=<',h,'>');
  return 'hello world';
}

onRequestCrystalHash = (request, h) => {
  //console.log('onRequest::onRequestCrystalHash=<',onRequestCrystalHash,'>');
  //console.log('onRequest::h=<',h,'>');
  if(request && request.params && request.params.name) {
    let hash = request.params.name
    console.log('onRequestCrystalHash:: hash=<',hash,'>');
    let path = ROOT_HASH_ACHIVE;
    path += '/' + hash.slice(0,2);
    path += '/' + hash.slice(2,4);
    path += '/' + hash.slice(4,6);
    path += '/' + hash;
    console.log('onRequestCrystalHash:: path=<',path,'>');
    const msg = fs.readFileSync(path, {encoding: 'utf-8'});
    console.log('onRequestCrystalHash:: msg=<',msg,'>');
    return msg;
  }
  return '';
}


const routeTable = [
  {
    method: 'GET',
    path:'/', 
    handler: onRequestRoot
  },
  {
    method: 'GET',
    path:'/crystal/{name}', 
    handler: onRequestCrystalHash
  },
];

server.route(routeTable);

start = async () => {
  try {
    await server.start();
  }
  catch (err) {
    console.log('start::err=<',err,'>');
  }  
}

start();
