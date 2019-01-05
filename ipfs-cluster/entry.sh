#! /usr/bin/env bash
npm update --save
set -e
if [ -n "$IPFS_PATH" ]; then
  echo "Using $IPFS_PATH as IPFS repository"
else
  echo "You need to set IPFS_PATH environment variable to use this script"
  exit 1
fi

# Initialize the repo but ignore if error if it already exists
# This can be the case when we restart a container without stopping/removing it
node node_modules/ipfs/src/cli/bin.js init || true

node node_modules/ipfs/src/cli/bin.js daemon
