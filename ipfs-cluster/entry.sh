#! /usr/bin/env bash
npm update --save
cp -f config-nodejs.js node_modules/ipfs/src/core/runtime/config-nodejs.js
