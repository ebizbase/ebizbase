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

# Split set of shard URLs text by ';' separator
IFS=';' set -- $SHARD_LIST

# Add each shard definition to the cluster
for shard in "$@"; do  
    $MONGO_CMD --port 27017 <<EOF
        sh.addShard("${shard}");
EOF
done
