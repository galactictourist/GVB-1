#! /bin/sh

yarn typeorm migration:create "./src/database/migrations/${1:-Migration}"
