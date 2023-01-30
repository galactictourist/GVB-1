#! /bin/sh

pm2 start yarn --name "${1-givabit}" -- start

pm2 start yarn --name "${1-givabit}-worker" -- start worker
