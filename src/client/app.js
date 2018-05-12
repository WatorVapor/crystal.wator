const express = require("express");
let app = express();

let server = app.listen(3000,'localhost',function(){
  console.log('server.address()=<',server.address(),'>');
});
const router  = express.Router();

console.log('router=<',router,'>');

