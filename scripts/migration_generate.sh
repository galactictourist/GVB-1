#! /bin/sh

if [[ $# -eq 0 ]] ; then
    echo 'Missing migration name'
    exit 1
fi

yarn typeorm -d ./src/database/typeorm.config.ts migration:generate "./src/database/migrations/${1:-Migration}"
