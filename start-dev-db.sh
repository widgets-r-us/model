#!/usr/bin/env bash

# Ensure you've ran `npm install` before running this script
mkdir node_modules/mongodb-server/logs
mkdir dev-db
mkdir dev-db/data
mkdir dev-db/data/db
mkdir dev-db/logs
touch dev-db/logs/mongo.log
node_modules/mongodb-server/bin/mongod --dbpath dev-db/data/db --logpath dev-db/logs/mongo.log --storageEngine=mmapv1
read -p "Press enter to exit"
