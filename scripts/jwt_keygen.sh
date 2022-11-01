#! /bin/sh

ssh-keygen -t rsa -P "" -b 4096 -m PEM -f .jwt-rs256.key
ssh-keygen -e -m PEM -f .jwt-rs256.key > .jwt-rs256.pub.key
