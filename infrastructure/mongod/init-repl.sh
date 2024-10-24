#!/bin/sh

# Check if /usr/bin/mongosh exists, otherwise use /usr/bin/mongo
if [ -x /usr/bin/mongosh ]; then
    MONGO_CMD="/usr/bin/mongosh"
else
    MONGO_CMD="/usr/bin/mongo"
fi

# Wait until local MongoDB instance is up and running
until $MONGO_CMD --port 27017 --quiet --eval 'db.getMongo()'; do
    sleep 1
done

# Configure a MongoDB replica set if this replica has been asked to
$MONGO_CMD --port 27017 <<EOF
    rs.initiate({_id: "${REPL_NAME}", members: [
        {_id: 0, host: "${NODE_HOST}:27017"},
    ], settings: {electionTimeoutMillis: 2000}});
EOF


