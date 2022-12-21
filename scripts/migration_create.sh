#! /bin/sh

if [[ $# -eq 0 ]] ; then
    echo 'Missing migration name'
    exit 1
fi

yarn typeorm migration:create "./apps/main/src/database/migrations/${1:-Migration}"
