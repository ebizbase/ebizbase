#!/bin/sh

exec /init-repl.sh &
# Run DockerHub's "official image" entrypoint now
exec /usr/local/bin/docker-entrypoint.sh "$@"