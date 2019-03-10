#! /usr/bin/env bash
npm install --save
cp -f config-nodejs.js node_modules/ipfs/src/core/runtime/config-nodejs.js
cp -f init-and-daemon.sh node_modules/ipfs/init-and-daemon.sh
cd node_modules/ipfs && ./init-and-daemon.sh
