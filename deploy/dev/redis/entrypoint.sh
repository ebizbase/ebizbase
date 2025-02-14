#!/bin/sh

redis-server &
node /redis-commander/bin/redis-commander.js --redis-host 127.0.0.1 --redis-label local --port 8081 &

exec "$@"
