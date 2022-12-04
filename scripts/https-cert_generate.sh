#! /bin/sh

mkdir -p secrets/https-cert
cd secrets/https-cert
openssl req -x509 -nodes -subj '/CN=localhost'  -newkey rsa:4096 -keyout ./private-key.pem -out ./public-cert.pem -days 3650
