#! /bin/sh

yarn typeorm -d ./src/database/typeorm.config.ts migration:generate "./src/database/migrations/$1"
