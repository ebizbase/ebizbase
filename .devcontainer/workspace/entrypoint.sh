echo "======================================"
echo "=        eBizBase DEVCONTAINER       ="
echo "======================================"
echo "Container started!"

#!/bin/sh
echo "Starting docker daemon"

# Start Docker daemon
dockerd&

# Wait until Docker socket is available
while [ ! -S /var/run/docker.sock ]; do
  sleep 1
done


sleep 3
echo '{"credsStore": "pass"}' > ~/.docker/config.json

# Now execute any additional commands
exec "$@"
