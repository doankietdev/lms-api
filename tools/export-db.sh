#!/bin/bash

DB_NAME="lms"
MONGO_URI="mongodb://host.docker.internal:27017/$DB_NAME"
DB_DIR="$(pwd)/db"

if [ -d "$DB_DIR" ]; then
    echo "$DB_DIR directory already exists, deleting..."
    rm -rf "$DB_DIR"
    echo "$DB_DIR directory deleted successfully."
fi

echo "Exporting database..."

docker run --rm \
  -v "$DB_DIR:/mongo-seed/$DB_NAME" \
  --add-host host.docker.internal:host-gateway \
  -it mongo:8.0.0 \
  /bin/bash -c "mongodump --uri '$MONGO_URI' -o /mongo-seed"

if [ $? -eq 0 ]; then
    echo "Database exported successfully."
else
    echo "Database export failed!"
fi
