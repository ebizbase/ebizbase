#!/bin/bash

# Remove all data
rm -rf /data/db/*
rm -rf /data/configdb/*

# Starting MongoDB
mongod --replSet rs0 --bind_ip_all &

# Initialize replica set
until mongosh --quiet --eval "rs.initiate()"; do
    sleep 0.5
done

# Start mongo express
cd /mongo-express
yarn start &

exec "$@"
