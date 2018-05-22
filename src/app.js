const ApiWS  = require('./websocketapi.js');
const Wallet  = require('./wallet.js');
let myWallet = new Wallet('wallet.dat');
let api = new ApiWS(myWallet);

/*
let addressAll = myWallet.getAllAddress();
console.log('addressAll=<',addressAll,'>');
let first = myWallet.signTransaction(addressAll[0],'test');
console.log('first=<',first,'>');
*/
/*
myWallet.pay(1000,'')
*/
