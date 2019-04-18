const Chair = require('./round-table').Chair;
//console.log('Chair=<',Chair,'>');
let chair = new Chair();
chair.onReady = (node) => {
  //console.log('node=<',node,'>');
  onReadTopBlock();
}

const iConstBlockDealDelay = 1000 * 20;

let gTopBlockAddress = '3gdwU8E3TJPHw2LLSLKn1ommiLrf';
let gRecentPublished = '';
onReadTopBlock = () => {
  readCrystalBlockByAddress(gTopBlockAddress,(block)=>{
    onBlockContents(block);
  });
};

onBlockContents = (block) => {
  //console.log('onBlockContents block=<',block,'>');
  console.log('onBlockContents gTopBlockAddress=<',gTopBlockAddress,'>');
  try {
    let jsonBlock = JSON.parse(block);
    gTopBlockAddress = jsonBlock.prev;
    let card = {cid : gTopBlockAddress};
    console.log('onBlockContents card=<',card,'>');
    chair.publish(card);
    setTimeout(()=>{
      onReadTopBlock();
    },iConstBlockDealDelay);
  } catch (e) {
    console.log('onBlockContents e=<',e,'>');
  }
}

const https = require('https');
const strConstCrystalRoot = 'https://crystal.wator.xyz:8443/crystal';
readCrystalBlockByAddress = (address,cb) => {
  //console.log('readCrystalBlockByAddress address=<',address,'>');
  let uri = strConstCrystalRoot;
  uri += '/' + address;
  //console.log('readCrystalBlockByAddress uri=<',uri,'>');
  https.get(uri,(res) => {
    let body = '';
    res.on('data', (d) => {
      //console.log('readCrystalBlockByAddress d=<',d,'>');
      body += d.toString('utf-8');
    });
    res.on('end', (evt) => {
      //console.log('readCrystalBlockByAddress body=<',body,'>');
      let checkAddress = addressOfContent(body);
      if(checkAddress === address) {
        cb(body);
      }
    });
  }).on('error', (e) => {
    console.log('readCrystalBlockByAddress e=<',e,'>');
  });
  //console.log('readCrystalBlockByAddress req=<',req,'>');
}

const shake256=require('js-sha3').shake256;
const sha3_224=require('js-sha3').sha3_224;
const bs58 = require('bs58');

addressOfContent = (content) => {
  let shake = shake256(content,160);
  //console.log('addressOfContent shake=<',shake,'>');
  const bytes = Buffer.from(shake,'hex');
  const address = bs58.encode(bytes);
  //console.log('addressOfContent address=<',address,'>');  
  return address;
}

