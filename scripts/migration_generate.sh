#! /bin/sh

if [[ $# -eq 0 ]] ; then
    echo 'Missing migration name'
    exit 1
fi

yarn typeorm -d ./apps/main/src/database/typeorm.config.ts migration:generate "./apps/main/src/database/migrations/${1:-Migration}"
