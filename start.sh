#! /bin/sh

yarn build && pm2 start dist/apps/main/main.js --name "${1-givabit}"
