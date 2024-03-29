#! /bin/sh

mkdir -p secrets/jwt
cd secrets/jwt
ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwt-rs256.key
rm jwt-rs256.key.pub
ssh-keygen -e -m PEM -f jwt-rs256.key > jwt-rs256.pub.key
